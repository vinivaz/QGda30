import {
	newImgBlock,
	newTweetBlock,
	newTxtBlock,
	newVideoBlock
} from './blockGenerator.js'

import { mapIcon } from './postMap.js';

export function addBlock(blockType, post) {
	if (blockType == 'text') {
		var nextBlockID = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

		var newBlock = {
			type: "text",
			content: '',
			id: nextBlockID
		}

		post.blocks.push(newBlock)

		newTxtBlock(newBlock, '', post)
		mapIcon(newBlock)
		return;
	}

	if (blockType == 'img') {
		var nextBlockID = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

		var newBlock = {
			type: "img",
			url: '',
			id: nextBlockID
		}

		post.blocks.push(newBlock)

		newImgBlock(newBlock, '', post)
		mapIcon(newBlock)

		return
	}

	if (blockType == 'tweet') {
		var nextBlockID = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

		var newBlock = {
			type: "tt-embed",
			content: '',
			id: nextBlockID
		}

		post.blocks.push(newBlock)

		newTweetBlock(newBlock, '', post)
		mapIcon(newBlock)

		return
	}

	if (blockType == 'video') {
		var nextBlockID = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

		var newBlock = {
			type: "yt-embed",
			content: '',
			id: nextBlockID
		}

		post.blocks.push(newBlock)

		newVideoBlock(newBlock, '', post)
		mapIcon(newBlock)

		return
	}
}

export function removeBlock(blockID, post) {
	$('div#' + blockID).remove()
	$('div#' + blockID + '-map').parent().css({ 'background-color': 'red', 'width': '50px' })
	$('div#' + blockID + '-map').parent().remove()
	var blocks = post.blocks
	console.log(blocks)
	for (var i = blocks.length; i--;) {
		if (blocks[i].id == blockID) {
			blocks.splice(i, 1);
			console.log(blocks)
		}
	}
}