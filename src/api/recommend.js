import axios from 'axios';

export const recommendVideoFeed = (page) => {
    return axios.get('/mock/recommend/video/feed')
}
