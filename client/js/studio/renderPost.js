import gerenateTweet from "./loadTweet"
import loadVideo from "./loadVideo"

var postElement = $('div.post-simulation')
var returnBtn = $('div.return > button')

returnBtn.on('click', () => {
	postElement.css('display', 'none')
})

var simulatedTitle = $('div.simulated-title > h1')
var simulatedData = $('div.simulated-data')
var simulatedBlocks = $('div.simulated-blocks')

export default function startSimulation(post) {

	$('div.simulated-title > h1, div.simulated-data, div.simulated-blocks').empty()

	simulatedTitle.text(post.title)
	simulatedData.append(`
        <span>${getDate(post.createdAt)}</span>
        <span>De: ${post.author.name}</span>
    `)

	post.blocks.map(block => {
		if (block.type == 'img') {
			simulateImgBlock(block)
			return
		}
		if (block.type == 'text') {
			simulateTxtBlock(block)
			return
		}
		if (block.type == 'tt-embed') {
			simulateTweetBlock(block)
			return
		}
		if (block.type == 'yt-embed') {
			simulateVideoBlock(block)
			return
		}
	})

	postElement.css('display', 'flex')
	console.log(post)

}

function getDate(date){
	var currentdate = new Date(date);
	return `${currentdate.getDate()}/${(currentdate.getMonth() + 1)}/${currentdate.getFullYear()}`
}

function simulateImgBlock(block) {
	simulatedBlocks.append(`
    <div class="simulated-block img">
      <img src="${block.url}">
			<div class="simulated-img-details">
				${block.description ?
				`<div class="simulated-description">
					<span>${block.description}</span>
				</div>`
				:
				''
				}
				${block.credits ?
				`<div class="simulated-link">
					<a href="${block.credits.link}" target="_blank" rel="noopener noreferrer">${block.credits.content}</a>
				</div>`
				:
				''
				}
			</div>
    </div>
    `)

}

function simulateTxtBlock(block) {
	simulatedBlocks.append(`
    <div class="simulated-block txt">
			<p>${block.content}</p>
		</div>
    `)
}

function simulateTweetBlock(block) {
	console.log(block)

	simulatedBlocks.append(`
	<div class="simulated-block tt">
		<div class="simulated-block-content" id="${block.id}-tt-simulation"></div>
	</div>
	`)

	var tweetDiv = document.getElementById(block.id + '-tt-simulation')

	gerenateTweet(block.content, tweetDiv)
}

function simulateVideoBlock(block) {
	simulatedBlocks.append(`
	<div class="simulated-block yt">
		<div class="simulated-block-content" id="${block.id}-yt-simulation">
			<div id="${block.id}-yt-video"></div>
		</div>
	</div>
	`)

	loadVideo(block.content, (block.id + '-yt-video'))

	console.log(block)
}