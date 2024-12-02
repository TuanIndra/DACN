import axiosInstance from '../utils/axiosConfig';

export const searchApi = async (keyword) => {
  const response = await axiosInstance.get(`/api/search?keyword=${encodeURIComponent(keyword)}`);
  return response.data;
};
