import axios from "axios";
import { axiosMoviesDatabase } from '../api/axiosDefaults'

// Fetch more data of the next list
export const fetchMoreData = async (resource, setResource) => {
  try {
    const { data } = await axios.get(resource.next);
    console.log('New data: ', data)
    setResource((prevResource) => ({
      ...prevResource,
      next: data.next,
      results: data.results.reduce((acc, cur) => {
        return acc.some((accResult) => accResult.id === cur.id)
          ? acc
          : [...acc, cur];
      }, prevResource.results),
    }));
  } catch (errors) {
    const error = errors.response?.data
  }
}

// Fetch more data if its a url
export const fetchMoreDataURL = async (data, setData) => {
    try {
        // const response = await axios.get(data.next)
        const response = await axiosMoviesDatabase.get(`https://moviesdatabase.p.rapidapi.com${data.next}`)
        setData((prevData) => ({
          ...prevData,
          next: response.data.next,
          results: [...prevData.results, ...response.data.results],
        }));
    } catch (error) {
        console.error('Error fetching more data:', error);
    }
  }