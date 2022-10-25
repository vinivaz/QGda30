import api from '../../tools/api';
import { popScreen, popWarningScreen, popOptsScreen, popUpElement } from '../global/dialogScreen';

var profile;

var allUsers;

var showing = false;

var canMakeRequest = true;

var profileElement = $('div.profile-data')

var usersElement = $('div.profile-box > .users')

var freshManList;

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

$('.add-freshman').on('click', function(){

    var addFreshmanScreen = `
        <div class="add-user-screen">
            <div class="add-user-title"><p>Adicionar usuário</p></div>

            <div class="screen-info">
                <p>
                    <div>O cadastro de novos usuários do QG só é possivel aos e-mails que estiverem na registrados na lista de e-mails permitidos administradores podem adicionar ou remover emails desta lista.</div>
                    <div><br></div>
                    <div>Após o registro o dono do e-mail tem 24 horas para cadastrar na conta do QG da 30, depois disso, o e-mail expira e será necessario que um administrador faça um novo registro.</div>
                    <div><br></div>
                    <div>O botão de entrar para o QG na página de cadastro só aparece caso exista algum e-mail não expirado na lista.</div>"
                </p>
            </div>



            <div class="freshman-list-container">
                <div class="freshman-list-header">
                    <p>Lista de E-mails</p>
                </div>
                <div class="freshman-list"></div>
            </div>
        </div>
    `

    var hideElement = popUpElement(addFreshmanScreen)

})

export function getProfile(){
    api.get('/app/profile/find')
    .then(res => {
        profile = res.data.loggedUser;
        allUsers = res.data.allUsers;


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
                </div>
            `)
    })

    // allUsers.map(user => {

    //     var size = 20;
    //     for(var i = 0; i < size; i++){
    //         usersElement.append(`
    //             <div class="user" id="${user._id}">
    //                 <div class="user-data">
    //                     <div class="user-avatar">
    //                         <div
    //                             class="avatar"
    //                             ${user.profile_img != ''?
    //                                 `style="background-image:url('${user.profile_img}')"`
    //                             :
    //                                 ''
    //                             }
    //                         >
    //                         </div>
    //                     </div>
    //                     <div class="user-name"><p>${user.name}</p></div>
    //                 </div>
    //                 <div class="user-opts">options</div>
    //             </div>
    //         `)
    //     } 
    // })

    usersHandler()
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
        setProfilePic(e)
    })

    $('button#deleteProfilePic').on('click', function(){
       var {element, confirm} = popScreen('Deseja mesmo remove sua foto de perfil?')

       confirm.on('click', function(){
        element.remove()
        removeProfilePic()
       })
    })
}

function usersHandler(){
    $('.users > .user').on('click', function(e){
        console.log(e)
        console.log(e.currentTarget.id)

        var userID =  e.currentTarget.id
        
        for(var i = 0; i < allUsers.length; i++){
            if(allUsers[i]._id == userID){
                console.log(allUsers)

                var options = `
                    <button id="filter" class="opt">
                        Publicações de ${allUsers[i].name}
                    </button>
                    <button id="admin" class="opt">Tornar admnistrador</button>
                    ${profile.admin == false ? '<button id="admin" class="opt">Tornar admnistrador</button>': ''}
                `
    
                popOptsScreen($('div#content'), options)

                $('#admin').on('click', function(){
                    turnAdmin(userID)
                })

            }
        }

    }) 
}



function turnAdmin(newAdminId){
    api.put('/app/profile/admin', {newAdminId})
    .then(res => {

        if(res.data.dialogError){
            popWarningScreen(res.data.errorDialog, $('#content'))
            return
        }

        getProfile()

    })
    .catch(err => {
        console.log(err)
        popWarningScreen('Houve um erro :( mas tenta denovo depois ', $('#content'))
    })
}

function setProfilePic(e){
    if(e.target.files && e.target.files.length > 0){

        if(!canMakeRequest)return;
        canMakeRequest = false 

        var formData = new FormData();
        console.log(e.target.files[0])
        formData.append("file", e.target.files[0])

        api.post('/app/profile/edit_profile_pic', formData, { headers: { "Content-Type": `multipart/form-data; boundary=${formData._boundary}` } })
        .then(res => {
            if(res.data.errorDialog){
                popWarningScreen(res.data.errorDialog, $('#content'))
                canMakeRequest = true;
                return
            }

            profile = res.data;
            setProfile()
            canMakeRequest = true;
        })
        .catch(err => {
            console.log(err)
            popWarningScreen('Não deu pra colocar foto :( mas tenta denovo depois ', $('#content'))
            canMakeRequest = true;
        })

    }
}

function removeProfilePic(){
    api.put('/app/profile/remove_profile_pic')
    .then(res => {
        if(res.data.errorDialog){
            popWarningScreen(res.data.errorDialog, $('#content'))
            return
        }

        profile.profile_img = ""
        setProfile()
        return
    })
    .catch(err => {
        console.log(err)
        popWarningScreen('Houve um erro, mas tenta denovo depois', $('#content'))
    })
}