import api from "../../tools/api";


export function deleteImage(url){

    // const img = url.slice(29)
    const img = url.slice(36)

    api.delete(`/app/posts/delete_image/${img}`)
    .then(res => {
        console.log(res.data.result)
    })
}

export function deletePostBlockImage(url){

    // const img = url.slice(29)
    const img = url.slice(36)

    api.delete(`/app/posts/delete_image/${img}`)
    .then(res => {
        console.log(res.data.result)
    })
}

export function deleteAdImage(url){

    // const img = url.slice(25)
    const img = url.slice(32)

    api.delete(`/app/ads/delete_ad_image/${img}`)
    .then(res => {
        console.log(res.data.result)
    })
}