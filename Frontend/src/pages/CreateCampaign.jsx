import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { campaignAPI } from '../services/api';
import { PhotoIcon, VideoCameraIcon, PlusIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const CreateCampaign = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const preselectedType = query.get('typeOfCampaign') || 'donation';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Education',
    typeOfCampaign: preselectedType,
    goalAmount: '',
    location: '',
    // Equity fields
    valuation: '',
    equity_offered: '',
    minimum_investment: '',
    // Debt fields
    interest_rate: '',
    loan_term: '',
    repayment_schedule: 'monthly',
  });

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [rewards, setRewards] = useState([{ amount: '', description: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Education','Medical','Charity','Technology','Arts','Environment','Community','Other',
  ];

  const isReward = useMemo(() => formData.typeOfCampaign === 'reward', [formData.typeOfCampaign]);
  const isEquity = useMemo(() => formData.typeOfCampaign === 'equity', [formData.typeOfCampaign]);
  const isDebt = useMemo(() => formData.typeOfCampaign === 'debt', [formData.typeOfCampaign]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    setImages([...images, ...files]);
  };

  const removeImage = (index) => setImages(images.filter((_, i) => i !== index));

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 100 * 1024 * 1024) {
      alert('Video file size must be less than 100MB');
      return;
    }
    setVideo(file);
  };

  const handleRewardChange = (index, field, value) => {
    const updated = [...rewards];
    updated[index][field] = value;
    setRewards(updated);
  };

  const addReward = () => setRewards([...rewards, { amount: '', description: '' }]);
  const removeReward = (index) => setRewards(rewards.filter((_, i) => i !== index));

  const validate = () => {
    if (!formData.title || !formData.description || !formData.goalAmount) {
      return 'Please fill in all required fields';
    }
    if (parseFloat(formData.goalAmount) <= 0) {
      return 'Goal amount must be greater than 0';
    }
    if (images.length === 0) {
      return 'Please upload at least one image';
    }
    if (isReward) {
      const valid = rewards.some(r => r.amount && r.description);
      if (!valid) return 'Please add at least one valid reward tier';
    }
    if (isEquity) {
      if (!formData.valuation || !formData.equity_offered || !formData.minimum_investment) {
        return 'Please provide valuation, equity offered and minimum investment';
      }
    }
    if (isDebt) {
      if (!formData.interest_rate || !formData.loan_term) {
        return 'Please provide interest rate and loan term for debt model';
      }
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('category', formData.category);
      fd.append('typeOfCampaign', formData.typeOfCampaign);
      fd.append('goalAmount', formData.goalAmount);
      fd.append('creatorId', user.id);
      fd.append('creatorType', user.role);
      if (formData.location) fd.append('location', formData.location);

      // Model-specific fields
      if (isEquity) {
        fd.append('valuation', formData.valuation);
        fd.append('equity_offered', formData.equity_offered);
        fd.append('minimum_investment', formData.minimum_investment);
      }
      if (isDebt) {
        fd.append('interest_rate', formData.interest_rate);
        fd.append('loan_term', formData.loan_term);
        fd.append('repayment_schedule', formData.repayment_schedule);
      }

      const validRewards = isReward ? rewards.filter(r => r.amount && r.description) : [];
      if (validRewards.length > 0) {
        fd.append('rewards', JSON.stringify(validRewards));
      }
      images.forEach((img) => fd.append('images', img));
      if (video) fd.append('video', video);

      const response = await campaignAPI.createCampaign(fd);
      if (response.success) {
        alert('Campaign created successfully!');
        navigate(`/campaigns/${response.campaign.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to create a campaign</h2>
          <button onClick={() => navigate('/login')} className="text-primary-600 hover:text-primary-700">Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Start a Campaign</h1>
        <p className="text-gray-600 mb-8">Fill in the details below to create your crowdfunding campaign</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">{error}</div>}

          {/* Funding Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Funding Model *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['donation','reward','equity','debt'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, typeOfCampaign: t })}
                  className={`px-4 py-2 rounded-lg border text-sm font-semibold capitalize ${
                    formData.typeOfCampaign === t ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-700 hover:border-primary-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-start text-sm text-gray-600 mt-2">
              <InformationCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
              Choose the model that best fits your project.
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Title *</label>
            <input name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="6" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input name="location" value={formData.location} onChange={handleChange} placeholder="City, Country" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Funding Goal (₹) *</label>
              <input type="number" name="goalAmount" value={formData.goalAmount} onChange={handleChange} min="1" step="0.01" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>

          {/* Equity Fields */}
          {isEquity && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valuation (₹) *</label>
                <input type="number" name="valuation" value={formData.valuation} onChange={handleChange} min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Equity Offered (%) *</label>
                <input type="number" name="equity_offered" value={formData.equity_offered} onChange={handleChange} min="0.01" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text.sm font-medium text-gray-700 mb-2">Minimum Investment (₹) *</label>
                <input type="number" name="minimum_investment" value={formData.minimum_investment} onChange={handleChange} min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
          )}

          {/* Debt Fields */}
          {isDebt && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (% p.a.) *</label>
                <input type="number" name="interest_rate" value={formData.interest_rate} onChange={handleChange} min="0.01" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (months) *</label>
                <input type="number" name="loan_term" value={formData.loan_term} onChange={handleChange} min="1" step="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Repayment Schedule</label>
                <select name="repayment_schedule" value={formData.repayment_schedule} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
          )}

          {/* Images Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Images * (Max 5)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="cursor-pointer text-primary-600 hover:text-primary-700 font-medium">Click to upload images</label>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded-lg" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Video (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" id="video-upload" />
              <label htmlFor="video-upload" className="cursor-pointer text-primary-600 hover:text-primary-700 font-medium">{video ? video.name : 'Click to upload video'}</label>
              <p className="text-sm text-gray-500 mt-1">MP4, MOV up to 100MB</p>
            </div>
          </div>

          {/* Rewards */}
          {isReward && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rewards (Optional)</label>
              <p className="text-sm text-gray-500 mb-3">Offer rewards to your backers at different contribution levels</p>
              {rewards.map((reward, index) => (
                <div key={index} className="border rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Reward {index + 1}</h4>
                    {rewards.length > 1 && (
                      <button type="button" onClick={() => removeReward(index)} className="text-red-500 hover:text-red-700">
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="number" placeholder="Amount (₹)" value={reward.amount} onChange={(e) => handleRewardChange(index, 'amount', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                    <input type="text" placeholder="Reward description" value={reward.description} onChange={(e) => handleRewardChange(index, 'description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 md:col-span-2" />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addReward()} className="flex items-center text-primary-600 hover:text-primary-700 font-medium">
                <PlusIcon className="h-5 w-5 mr-1" /> Add another reward
              </button>
            </div>
          )}

          {/* Submit */}
          <div className="flex space-x-4 pt-6 border-t">
            <button type="button" onClick={() => navigate('/campaigns')} className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating...' : 'Launch Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;


