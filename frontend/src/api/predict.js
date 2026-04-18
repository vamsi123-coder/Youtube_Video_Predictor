import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const predictVideo = async (payload) => {
  const response = await axios.post(`${API_BASE}/predict`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};
