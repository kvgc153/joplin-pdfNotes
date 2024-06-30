// Fill these out //
var joplinToken = "";
var joplinPort = 41184;
///////////////////

var webpageTitle = document.title;
var webPageUrl = window.location.href.replace(/(^\w+:|^)\/\//, '');
webPageUrl = webPageUrl.split("#")[0];
webpageTitle = webpageTitle.replace(".", "_");


let outerContainerPDF = document.getElementById("outerContainer"); 
outerContainerPDF.style.width = "60%";

let noteButton = document.createElement('button'); 
noteButton.innerText = "Insert page reference";
noteButton.style.backgroundColor = "#3f51b5"; // Indigo
noteButton.style.border = "none";
noteButton.style.color = "white";
noteButton.style.padding = "10px 20px";
noteButton.style.textAlign = "center";
noteButton.style.textDecoration = "none";
noteButton.style.display = "inline-block";
noteButton.style.fontSize = "14px";
noteButton.style.margin = "4px 2px";
noteButton.style.cursor = "pointer";
noteButton.style.left = "60%";
noteButton.style.bottom = "88%";
noteButton.style.height = "auto";
noteButton.style.position = "fixed";
noteButton.style.width = "auto";
noteButton.style.zIndex = "100";
noteButton.style.borderRadius = "12px"; // Rounded corners
noteButton.style.boxShadow = "0 8px 16px 0 rgba(0,0,0,0.2)"; // Shadow effect

noteButton.onclick = function(){
    var pageNumber = PDFViewerApplication.pdfViewer.currentPageNumber;
    var url = document.URL;
    document.getElementById("WBJSnote").innerHTML += '<a href="' + url + "#page=" + pageNumber +'">Page: ' + pageNumber + '</a>';


    // Append the button to body
    document.getElementById("WBJSnote").innerHTML += ` <button style="background-color: #3f51b5; border: none; color: white; padding: 10px 20px; text-align: center; cursor:pointer; text-decoration: none; display: inline-block; font-size: 14px; margin: 4px 2px; border-radius: 12px; box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);" onClick="PDFViewerApplication.pdfViewer.currentPageNumber = ${pageNumber}">Navigate</button>&nbsp;`;
    document.getElementById("WBJSnote").innerHTML += "<br>";

}


let note = document.createElement('div'); 
note.style.height="28%";
note.contentEditable="true";
note.style.backgroundColor = "#f5f5f5"; // Lighter gray
note.style.border = "1px solid #e0e0e0"; // Lighter border
note.style.padding = "20px";
note.style.resize="both";
note.style.overflow = "auto";
note.style.left = "60%";
note.style.bottom = "1%";
note.style.height = "80%";
note.style.position = "fixed";
note.style.width = "40%";
note.style.zIndex = "100";
note.id = "WBJSnote";
note.style.borderRadius = "12px"; // Rounded corners
note.style.boxShadow = "0 8px 16px 0 rgba(0,0,0,0.2)"; // Shadow effect





document.body.appendChild(noteButton);
document.body.appendChild(note);



async function fetchJson1(url) {
  var results = await fetch(url);
  var resultsJSON = await results.json();
  document.getElementById("WBJSnote").innerHTML = resultsJSON.items[0].body;
}
var url  = `http://localhost:${joplinPort}/search?token=` + joplinToken + "&query=" + webpageTitle + "&fields=id,title,body";
fetchJson1(url);




/// Export notes to Joplin
async function exportJoplinNotes(){

   
    var content = document.getElementById("WBJSnote").innerHTML;
    console.log("User asked to export notes to Joplin.");
    // console.log( exportHTML.join(''));

    async function fetchJson(url) {
      var results = await fetch(url);
      var resultsJSON = await results.json();
      if(resultsJSON.items.length == 0){

        // create note in Joplin
        fetch(`http://localhost:${joplinPort}/notes?token=` + joplinToken,
        {
            body: JSON.stringify({ 
              "title": webpageTitle , 
              "body": content, 
              "source_url": webPageUrl
      
            }),
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },          
        }
        );

        
      }

      if(resultsJSON.items.length == 1){


        fetch(`http://localhost:${joplinPort}/notes/`+resultsJSON.items[0].id+"?token=" + joplinToken,
        {
            body: JSON.stringify({ 
              "body": content, 
            }),
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },          
        }
        );

    }

      }
    
    fetchJson(`http://localhost:${joplinPort}/search?token=` + joplinToken + "&query=" + webpageTitle);
  
}
var intervalId = setInterval(exportJoplinNotes, 15000);


document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    exportJoplinNotes();
  }
});
