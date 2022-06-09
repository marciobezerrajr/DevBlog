import AsyncStorage from "@react-native-async-storage/async-storage";
import api from './api'

export async function getFavorite(){
    const data = await AsyncStorage.getItem('@favCategory')

    if(data !== null) {
        const resp = await api.get(`api/categories/${data}?fields=name&populate=posts,posts.cover`)

        return resp.data?.data?.attributes?.posts?.data

    } else {

        return []
    }
}

export async function setFavorite(category){
    await AsyncStorage.setItem('@favCategory', String(category))

    const res = await getFavorite()

    return res
}