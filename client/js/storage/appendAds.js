

export function sqrPicAd(ad, element){
    element.append(` 
    <div class="ad-item sqr-pic" id="${ad._id}">
        <div class="ad-item-header">
            <div class="img-place" >
               ${ad.squarePicture.url != ""?
                    `<img src="${ad.squarePicture.url}">`
                :
                    ''
                }
            </div>
        </div>
        <div class="ad-item-body">
            <h3>${ad.name} asgf hg df fdfdgf hg</h3>
            <div class="ad-details">
                <span class="owner">${ad.owner}</span>
                <span class="link">${ad.link}</span>
            </div>
        </div> 
    </div>
`)
}

export function rectPicAd(ad, element){
element.append(` 
    <div class="ad-item rect-pic" id="${ad._id}">
        <div class="ad-item-header">
            <div class="img-place">
               ${ad.rectanglePicture.url != ""?
                    `<img src="${ad.rectanglePicture.url}">`
                :
                    ''
                }
            </div>
        </div>
        <div class="ad-item-body">
            <h3>${ad.name} asgf hg df fdfdgf hg</h3>
            <div class="ad-details">
                <span class="owner">${ad.owner}</span>
                <span class="link">${ad.link}</span>
            </div>
        </div> 
    </div>
`) 
}