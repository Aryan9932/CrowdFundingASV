import pool from "../config/db.js";

/**
 * PostgreSQL Campaign Model
 * Maps to multiple tables: campaigns, campaign_media, campaign_likes,
 * campaign_discussions, rewards, investments, locations
 */

// Create a new campaign
export const createCampaign = async (campaignData) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      title,
      description,
      creatorId,
      creatorType,
      typeOfCampaign,
      category,
      goalAmount,
      location,
      media = { images: [], video: null },
      rewards = [],
    } = campaignData;

    // 1. Insert campaign
    const campaignQuery = `
      INSERT INTO campaigns (
        title, description, creator_id, creator_type, type_of_campaign,
        category, goal_amount, raised_amount, location, status, likes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 0, $8, 'active', 0)
      RETURNING *
    `;

    const campaignValues = [
      title,
      description,
      creatorId,
      creatorType,
      typeOfCampaign,
      category,
      goalAmount,
      location || null,
    ];

    const campaignResult = await client.query(campaignQuery, campaignValues);
    const campaign = campaignResult.rows[0];

    // 2. Insert media (images and video)
    if (media.images && media.images.length > 0) {
      for (const imageUrl of media.images) {
        await client.query(
          `INSERT INTO campaign_media (campaign_id, media_type, media_url) VALUES ($1, 'image', $2)`,
          [campaign.id, imageUrl]
        );
      }
    }

    if (media.video) {
      await client.query(
        `INSERT INTO campaign_media (campaign_id, media_type, media_url) VALUES ($1, 'video', $2)`,
        [campaign.id, media.video]
      );
    }

    // 3. Insert rewards
    if (rewards && rewards.length > 0) {
      for (const reward of rewards) {
        await client.query(
          `INSERT INTO rewards (campaign_id, tier_amount, description) VALUES ($1, $2, $3)`,
          [campaign.id, reward.amount, reward.description || null]
        );
      }
    }

    await client.query("COMMIT");

    // Fetch complete campaign with media and rewards
    return await fetchCampaignById(campaign.id);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Get campaign by ID with all related data
export const fetchCampaignById = async (id) => {
  const campaignQuery = `SELECT * FROM campaigns WHERE id = $1`;
  const campaignResult = await pool.query(campaignQuery, [id]);

  if (campaignResult.rows.length === 0) {
    return null;
  }

  const campaign = campaignResult.rows[0];

  // Fetch media
  const mediaResult = await pool.query(
    `SELECT media_type, media_url FROM campaign_media WHERE campaign_id = $1`,
    [id]
  );

  campaign.media = {
    images: mediaResult.rows
      .filter((m) => m.media_type === "image")
      .map((m) => m.media_url),
    video:
      mediaResult.rows.find((m) => m.media_type === "video")?.media_url || null,
  };

  // Fetch rewards
  const rewardsResult = await pool.query(
    `SELECT tier_amount as amount, description FROM rewards WHERE campaign_id = $1 ORDER BY tier_amount`,
    [id]
  );
  campaign.rewards = rewardsResult.rows;

  // Fetch likes count
  const likesResult = await pool.query(
    `SELECT COUNT(*) as likes FROM campaign_likes WHERE campaign_id = $1`,
    [id]
  );
  campaign.likes = parseInt(likesResult.rows[0].likes);

  // Fetch investments (backers)
  const backersResult = await pool.query(
    `SELECT user_id, amount, created_at FROM investments WHERE campaign_id = $1 ORDER BY created_at DESC`,
    [id]
  );
  campaign.backers = backersResult.rows;

  return campaign;
};

// Get all campaigns with filters
export const fetchAllCampaigns = async (filters = {}) => {
  let query = `
    SELECT c.*, 
           (SELECT COUNT(*) FROM campaign_likes WHERE campaign_id = c.id) as likes,
           (SELECT COUNT(*) FROM investments WHERE campaign_id = c.id) as backers_count
    FROM campaigns c
    WHERE 1=1
  `;

  const values = [];
  let paramIndex = 1;

  // Filter by category
  if (filters.category) {
    query += ` AND c.category = $${paramIndex}`;
    values.push(filters.category);
    paramIndex++;
  }

  // Filter by status
  if (filters.status) {
    query += ` AND c.status = $${paramIndex}`;
    values.push(filters.status);
    paramIndex++;
  }

  // Filter by creator
  if (filters.creatorId) {
    query += ` AND c.creator_id = $${paramIndex}`;
    values.push(filters.creatorId);
    paramIndex++;
  }

  // Filter by type
  if (filters.typeOfCampaign) {
    query += ` AND c.type_of_campaign = $${paramIndex}`;
    values.push(filters.typeOfCampaign);
    paramIndex++;
  }

  // Search by title or description
  if (filters.search) {
    query += ` AND (c.title ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`;
    values.push(`%${filters.search}%`);
    paramIndex++;
  }

  // Sorting
  if (filters.sort === "newest") {
    query += ` ORDER BY c.created_at DESC`;
  } else if (filters.sort === "popular") {
    query += ` ORDER BY likes DESC, backers_count DESC`;
  } else if (filters.sort === "goal") {
    query += ` ORDER BY c.goal_amount DESC`;
  } else {
    query += ` ORDER BY c.created_at DESC`;
  }

  // Pagination
  const limit = filters.limit || 20;
  const offset = filters.offset || 0;
  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  values.push(limit, offset);

  const result = await pool.query(query, values);

  // Fetch media for each campaign
  const campaigns = await Promise.all(
    result.rows.map(async (campaign) => {
      const mediaResult = await pool.query(
        `SELECT media_type, media_url FROM campaign_media WHERE campaign_id = $1`,
        [campaign.id]
      );

      campaign.media = {
        images: mediaResult.rows
          .filter((m) => m.media_type === "image")
          .map((m) => m.media_url),
        video:
          mediaResult.rows.find((m) => m.media_type === "video")?.media_url ||
          null,
      };

      return campaign;
    })
  );

  return campaigns;
};

// Update campaign
export const updateCampaign = async (id, updates) => {
  const allowedFields = [
    "title",
    "description",
    "goal_amount",
    "location",
    "status",
  ];

  const fields = [];
  const values = [];
  let paramIndex = 1;

  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key) && updates[key] !== undefined) {
      fields.push(`${key} = $${paramIndex}`);
      values.push(updates[key]);
      paramIndex++;
    }
  });

  if (fields.length === 0) {
    throw new Error("No valid fields to update");
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const query = `
    UPDATE campaigns 
    SET ${fields.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Delete campaign
export const deleteCampaign = async (id) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Delete related data
    await client.query(`DELETE FROM campaign_media WHERE campaign_id = $1`, [
      id,
    ]);
    await client.query(`DELETE FROM campaign_likes WHERE campaign_id = $1`, [
      id,
    ]);
    await client.query(
      `DELETE FROM campaign_discussions WHERE campaign_id = $1`,
      [id]
    );
    await client.query(`DELETE FROM rewards WHERE campaign_id = $1`, [id]);
    await client.query(`DELETE FROM investments WHERE campaign_id = $1`, [id]);

    // Delete campaign
    const result = await client.query(
      `DELETE FROM campaigns WHERE id = $1 RETURNING id`,
      [id]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Add investment (backer)
export const addInvestment = async (
  campaignId,
  userId,
  amount,
  visibility = true
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert investment
    await client.query(
      `INSERT INTO investments (campaign_id, user_id, amount, visibility) VALUES ($1, $2, $3, $4)`,
      [campaignId, userId, amount, visibility]
    );

    // Update raised amount
    await client.query(
      `UPDATE campaigns SET raised_amount = raised_amount + $1 WHERE id = $2`,
      [amount, campaignId]
    );

    await client.query("COMMIT");

    return await fetchCampaignById(campaignId);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Like/Unlike campaign
export const toggleCampaignLike = async (campaignId, userId) => {
  // Check if already liked
  const checkResult = await pool.query(
    `SELECT id FROM campaign_likes WHERE campaign_id = $1 AND user_id = $2`,
    [campaignId, userId]
  );

  if (checkResult.rows.length > 0) {
    // Unlike
    await pool.query(
      `DELETE FROM campaign_likes WHERE campaign_id = $1 AND user_id = $2`,
      [campaignId, userId]
    );
    return { liked: false };
  } else {
    // Like
    await pool.query(
      `INSERT INTO campaign_likes (campaign_id, user_id) VALUES ($1, $2)`,
      [campaignId, userId]
    );
    return { liked: true };
  }
};

// Add comment/discussion
export const addCampaignComment = async (campaignId, userId, comment) => {
  const query = `
    INSERT INTO campaign_discussions (campaign_id, user_id, comment)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const result = await pool.query(query, [campaignId, userId, comment]);
  return result.rows[0];
};

// Get campaign comments
export const fetchCampaignComments = async (campaignId) => {
  const query = `
    SELECT cd.*, u.first_name, u.last_name, u.profile_pic_url
    FROM campaign_discussions cd
    JOIN users u ON cd.user_id = u.id
    WHERE cd.campaign_id = $1
    ORDER BY cd.created_at DESC
  `;

  const result = await pool.query(query, [campaignId]);
  return result.rows;
};
