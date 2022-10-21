import api from '../../tools/api';
import { popWarningScreen, popOptsScreen } from '../global/dialogScreen';

var profile;

var allUsers;

var showing = false;

var canMakeRequest = true;

var profileElement = $('div.profile-data')

var usersElement = $('div.profile-box > .users')

getProfile()

$('.show-profile').on('click', function(){

    if(showing){
        $('div.profile-box').css('display', 'none')
        showing = false
    }else{
        $('div.profile-box').css('display', 'flex')
        showing = true
    }

})



export function getProfile(){
    api.get('/app/profile/find')
    .then(res => {
        profile = res.data.loggedUser;
        allUsers = res.data.allUsers;

        console.log(res.data)
        setProfile()
        setUsers()
    })

    
}




function setProfile(){
    profileElement.empty()

    var newProfileElements = `
        <div class="avatar-place">
            ${ profile.profile_img != '' ? 
                `<div class="avatar-img" style="background-image: url('${profile.profile_img}');"></div>`
                :
                `<div class="avatar-img"></div>`
            }
            
        </div>

        <div class="profile-info">
        
            <div class="profile-name">
            <p>${profile.name}</p>
            </div>

            <div class="profile-opts"></div>
        </div>
    `
    profileElement.append(newProfileElements)

    profileEvents()
}

function setUsers(){
    usersElement.empty()

    allUsers.map(user => {
        usersElement.append(`
            <div class="user" id="${user._id}">
                <div class="user-data">
                    <div class="user-avatar">
                        <div
                            class="avatar"
                            ${user.profile_img != ''?
                                `style="background-image:url('${user.profile_img}')"`
                            :
                                ''
                            }
                        >
                        </div>
                    </div>
                    <div class="user-name"><p>${user.name}</p></div>
                </div>
                <div class="user-opts">options</div>
            </div>
        `)
    })

}


function profileEvents(){
    avatarHandler()
}

function avatarHandler(){
    $('div.avatar-place').on('click', function(){
        var options = `
            <button id="setProfilePic" class="opt">
                Inserir foto
            </button>
            <input type="file" style="display: none;" accept="image/jpeg, image/png, image/jpg, image/jpng, image/gif">
            ${profile.profile_img != '' ? '<button id="deleteProfilePic" class="opt">Remover foto</button>': ''}
            
        `

        popOptsScreen($('div#content'), options)

        avatarOpts()
    })
}

function avatarOpts(){
    $('#setProfilePic').on('click', function(){
        console.log('clicou no setprofile')

        
        $('.opts > input').trigger('click')
    })

    $('.opts > input').on('change', function(e){
        if(e.target.files && e.target.files.length > 0){

            if(!canMakeRequest)return;
            canMakeRequest = false 

            var formData = new FormData();
            console.log(e.target.files[0])
            formData.append("file", e.target.files[0])

            api.post('/app/profile/edit_profile_pic', formData, { headers: { "Content-Type": `multipart/form-data; boundary=${formData._boundary}` } })
            .then(res => {
                profile = res.data;
                setProfile()
                canMakeRequest = true;
            })
            .catch(err => {
                console.log(err)
                popWarningScreen('Não deu pra colocar foto :( mas tenta denovo depois ',$('#content'))
                canMakeRequest = true;
            })

        }
    })

    $('button#deleteProfilePic').on('click', function(){
        popWarningScreen('vc clicou no botão de remover foto... pser',$('#content'))
    })
}

function usersHandler(){

}