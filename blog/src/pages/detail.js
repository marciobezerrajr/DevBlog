import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity, Share, Modal} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../services/api';
import { Feather, Entypo } from '@expo/vector-icons'
import LinkWeb from '../components/LinkWeb';

export default function Detail(id) {

    const route = useRoute()
    const navigation = useNavigation()

    const [post, setPost] = useState({})
    const [links, setLinks] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [openLink, setOpenLink] = useState({})


    useEffect(() => {
        async function getPost() {
            const res = await api.get(`api/posts/${route.params?.id}?populate=cover,category,options`)
            setPost(res.data.data)
            setLinks(res.data?.data?.attributes?.options)
        }

        getPost()

    }, [])

useLayoutEffect (() => {
    navigation.setOptions({
        headerRight: () => (
            <TouchableOpacity onPress={handleShare}>
                <Entypo name="share" size={25} color="#fff"/>
            </TouchableOpacity>
        )
    })
}, [navigation, post])

async function handleShare(){
    try{
        const result = await Share.share({
            
            message: `Confira esse post: ${post?.attributes?.title}
            
            ${post?.attributes?.description}

            de: DevBlog
            `
        })

        if (result.action === Share.sharedAction){
            if(result.activityType){
                console.log("Activity type")
            }
                else {
                    console.log("funcionamento ok")
                    console.log(result)
                }

        } else if (result.action === Share.dismissedAction){
            console.log('modal fechado')
        }
    }
 catch(err) {
    console.log(err)
 }
}

function handleOpenLink(link){
    setModalVisible(true)
    setOpenLink(link)
}

    return (
        <SafeAreaView style={styles.container}>
            <Image
                resizeMode='cover'
                style={styles.cover}
                source={{ uri: `http://192.168.0.104:1337${post?.attributes?.cover?.data?.attributes?.url}` }}
            />
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>
                    {post?.attributes?.title}
                </Text>

                <Text style={styles.description}>
                    {post?.attributes?.description}
                </Text>

                {links.length > 0 && (
                    <Text style={styles.subTitle}>Links</Text>
                )}


                {links.map(link => (
                    <TouchableOpacity
                        key={link.id}
                        style={styles.linkButton}
                        onPress={() => handleOpenLink(link)}>

                        <Feather name="link" color="#1e4687" size={14} />
                        <Text style={styles.linkText}>{link.name}</Text>

                    </TouchableOpacity>
                ))}

            </ScrollView>

            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <LinkWeb
                    link={openLink?.url}
                    title={openLink?.name}
                    closeModal={ ()=> setModalVisible(false)}
                />
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    cover: {
        width: '100%',
        height: 230
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 14,
        marginTop: 18,
        paddingHorizontal: 12
    },
    content: {
        paddingHorizontal: 12
    },
    description: {
        lineHeight: 20
    },
    subTitle: {
        fontWeight: 'bold',
        marginTop: 14,
        fontSize: 18,
        marginBottom: 6
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    linkText: {
        color: '#1e4687',
        fontSize: 16,
        marginLeft: 6
    }
})