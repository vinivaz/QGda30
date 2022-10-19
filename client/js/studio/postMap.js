

let mapElement = $('.map')

export function MapSortable(news, setResult) {
  const sortableDiv = $('div.map')
  sortableDiv.sortable({
    axis: 'y',
    start: function (e, ui) {

      // var mapIcons = $('div.map').children()
      // console.log(news.blocks)
      // console.log(ui.item.index())
      // console.log(ui.item.attr('blockIndex'))
      // for (var i = 0; mapIcons.length > i; i++) {
      //   var elementID = mapIcons[i].id
      //   var blockID = elementID.slice(0, elementID.length - 6)
      //   if (blockID) {

      //     var currentBlockData = checkBlockId(blockID)
      //     $(mapIcons[i]).attr('blockIndex', currentBlockData.index)
      //   }

      // }

      // function checkBlockId(id) {
      //   for (var i = 0; news.blocks.length > i; i++) {
      //     if (news.blocks[i].id == id) {
      //       return {
      //         block: news.blocks[i],
      //         index: i
      //       }
      //     }
      //   }
      // }

    },
    update: function (event, ui) {
      var temporaryBlock = [];
      var mapIcons = $('div.map').children()
      if (mapIcons.length > 0) {
        for (var i = 0; mapIcons.length > i; i++) {

          var elementID = mapIcons[i].id
          var blockID = elementID.slice(0, elementID.length - 6)

          if (blockID) {

            var currentBlockData = checkBlockId(blockID)
            temporaryBlock.push(currentBlockData)

          }
        }
      }

      function checkBlockId(id) {
        for (var i = 0; news.blocks.length > i; i++) {
          if (news.blocks[i].id == id) {
            return news.blocks[i]
          }
        }
      }

      news.blocks = temporaryBlock;
      console.log(news.blocks)
      setResult(news)
    }

  })
}

export function startMap(data) {
  var blocks = data.blocks;
  console.log(blocks)
  blocks.map(block => mapIcon(block))

}

export function mapIcon(block) {
  switch (block.type) {
    case 'text':
      newMapBlock('txt', block.id, 'images/text-only.svg')
      
      break;
    case 'img':
      newMapBlock('img', block.id, 'images/image-icon.svg')
      
      break;
    case 'tt-embed':
      newMapBlock('tt', block.id, 'images/twitter-circle.svg')
      
      break;
    case 'yt-embed':
      newMapBlock('yt', block.id, 'images/youtube-icon.svg')
      
      break;
  }
}

function newMapBlock(type, id, url) {
  let mapElement = $('.map')

  var mapBlockImg = '<img src="' + url + '">'
  var blockIconDiv = '<div class="block-icon ' + type + '" id="' + id + '-map" draggable="true">' + mapBlockImg + '</div>'
  var mapBlockVessel = '<div class="block-icon-vessel ' + type + '" id="' + id + '-b-map">' + blockIconDiv + '</div>'
  mapElement.append(mapBlockVessel)

  $('div#' + id + '-b-map').click(function () {
    console.log(this.id)

    var container = $('div.post-exemple')

    var blockID = this.id.slice(0, this.id.length - 6)

    var scrollTo = $("div#" + blockID + "-vessel");
    var position = scrollTo.offset().top
      - container.offset().top
      + container.scrollTop();

    container.animate({
      scrollTop: position
    });
  })
}


//   $('div.map').sortable({
//     axis: 'y',
//     start: function (e, ui) {

//       var mapIcons = $('div.map').children()
//       console.log(news.blocks)
//       console.log(ui.item.index())
//       console.log(ui.item.attr('blockIndex'))
//       for (var i = 0; mapIcons.length > i; i++) {
//         var elementID = mapIcons[i].id
//         var blockID = elementID.slice(0, elementID.length - 6)
//         if (blockID) {

//           var currentBlockData = checkBlockId(blockID)
//           $(mapIcons[i]).attr('blockIndex', currentBlockData.index)
//         }

//       }

//       function checkBlockId(id) {
//         for (var i = 0; news.blocks.length > i; i++) {
//           if (news.blocks[i].id == id) {
//             return {
//               block: news.blocks[i],
//               index: i
//             }
//           }
//         }
//       }

//     },
//     update: function (event, ui) {
//       var temporaryBlock = [];
//       var mapIcons = $('div.map').children()
//       if (mapIcons.length > 0) {
//         for (var i = 0; mapIcons.length > i; i++) {

//           var elementID = mapIcons[i].id
//           var blockID = elementID.slice(0, elementID.length - 6)

//           if (blockID) {

//             var currentBlockData = checkBlockId(blockID)
//             temporaryBlock.push(currentBlockData)

//           }
//         }
//       }

//       function checkBlockId(id) {
//         for (var i = 0; news.blocks.length > i; i++) {
//           if (news.blocks[i].id == id) {
//             return news.blocks[i]
//           }
//         }
//       }

//       news.blocks = temporaryBlock;
//       console.log(news.blocks)
//       setResult(news)
//     }

//   })