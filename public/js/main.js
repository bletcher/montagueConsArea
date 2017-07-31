// globals --------------------------------------------------------------------

var state = {
  fileName: undefined,
  caption: undefined,
  currentDate: undefined,
  flowIn: undefined,
  TandPIn: undefined,
  env: undefined,
  selectedResolution: "b", //z=medium, b=large
  setNameInfo: {
    consArea: {
      imgWidth: "10%"
    }
  },
  transitionDur: 2500,
  clickDate: []
};

var svg, g, x, y;
var svg2, g2, x2, y2;

// functions ------------------------------------------------------------------

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

function imgError(image) {
    image.onerror = "";
    image.src = "/img/noImage.gif";
    console.log('in error');
    return true;
}

function strToDate(s) {
  var d = new Date(s);
  var dd = Date.parse( new Date(d.getFullYear(),d.getMonth(),d.getDate()) );
  return dd;
}

function strToDate2(s) {
  var d = new Date(s);
  var dd = d.getFullYear();
  return dd;
}

function dateToStr(s) {
  var d = new Date(s);
  var dd = d.toDateString();
  return dd;
}

////////
//function defineCarousel(){
$('#carousel_consArea').on('slide.bs.carousel', function (e) {
  var slideFrom = $(this).find('.active').index();
  var slideTo = $(e.relatedTarget).index();
  console.log(slideFrom+' => '+slideTo);

  state.caption = $(e.relatedTarget).find('.carousel-caption').text();
  state.currentDate = strToDate(state.caption);
  //console.log("dates",state.caption,state.caption.slice(0,10),state.currentDate, new Date(state.currentDate).toDateString())

});
  
$("#carouselButtons :input").change(function() {
    if(this.id == 'stop') $('.carousel').carousel('pause');
    if(this.id == 'go')   $('.carousel').carousel('cycle');
});

$("#indicatorButtons :input").change(function() {
    if(this.id == 'yes') d3.select(".carousel-indicators").style("opacity", 1);
    if(this.id == 'no')  d3.select(".carousel-indicators").style("opacity", 0);
});

///////
// http://www.lovelldsouza.com/webdev/flickr-to-website/

var slideIndex = [];

function findDate(dd) {
  return dd >= state.clickDate;
}

function getImgs(setID,setName,callback) {

  var URL = "https://api.flickr.com/services/rest/" +
    "?method=flickr.photosets.getPhotos" +
    "&api_key=b17072d6e8c8f93662be1635ac49f557" +
    "&photoset_id=" + setID +  // The set ID.
    "&user_id=155284079@N03" +
//    "&privacy_filter=1" +  // 1 signifies all public photos.
    "&extras=date_taken" +
    "&format=json&nojsoncallback=1"
    ;

  $.getJSON(URL, function(data){
    $.each(data.photoset.photo, function(i, item){
      var img_src = "http://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_" + state.selectedResolution + ".jpg";
      var img_thumb = $("<img/>").attr("src", img_src).css("margin", "1px").css("width", state['setNameInfo'][setName]['imgWidth']);
      $(img_thumb).appendTo("#flickr-images_" + setName);

      // add images to carousel

      $('<div class="carousel-item"><img class="d-block img-fluid" src="' + img_src + '"><div class="carousel-caption d-none d-md-block"><h3>' + item.datetaken + ' </h3></div></div>').appendTo('.carousel-inner');

      $('<li data-target="#carousel_consArea" data-slide-to="'+ i +'"></li>').appendTo('.carousel-indicators');

      // create array dates with pictures
      slideIndex[i] = strToDate(item.datetaken);

      var tt = 480; //d3.select('.tooltip').node().offsetWidth;
      var xOffset, yOffset;

      img_thumb
        .on("mouseover", function(d) {

        tooltip.html('<h3>' + item.datetaken + " // " + item.title + '</h3><br><img class="object-fit-contain" src= ' + this.src + ' onerror="imgError(this);"/' + '>')

          .style("left", d3.select('.col-xs-12').node().offsetWidth / 4 + 'px')     
          .style("top",  d.target.y + 0 + "px")
          .style("width", d3.select('.col-xs-12').node().offsetWidth / 1.5 + 'px')
          .transition()
          .duration(100)
          .style("opacity", 1);

        })

        .on("mouseout", function (d) {
          d3.select(this);

          tooltip.transition()
            .duration(250)
            .style("opacity", 0);

        });

    });

    $('.carousel-item').first().addClass('active');
    $('.carousel-indicators > li').first().addClass('active');

    $('.carousel').carousel({
      interval: state.transitionDur
    });

  });
}


