/* Some code from <http://userscripts.org/scripts/show/7715> -- used with permission */

if(!window.getSelection && document.selection) {
   window.getSelection = function() {
      return document.selection.createRange().text;
   }//end new getSelection
}//end if IE

var meyshanlookup_sites = [
    {'name':'Wikipedia', 'url':'http://en.wikipedia.org/w/index.php?lookitup&title=%s&printable=yes'},
    {'name':'Wictionary', 'url':'http://en.wiktionary.org/w/index.php?lookitup&title=%s&printable=yes'},
    {'name':'Chambers (UK)', 'url':'http://www.chambersharrap.co.uk/chambers/features/chref/chref.py/main?lookitup&title=21st&query=%s'},
    {'name':'The Free Dictionary', 'url':'http://www.thefreedictionary.com/dict.asp?lookitup&Word=%s'},
    {'name':'Urban Dictionary', 'url':'http://www.urbandictionary.com/define.php?lookitup&term=%s'},
    {'name':'Engelsk-Dansk', 'url':'http://ordbogen.com/opslag.php?lookitup&word=%s&dict=enda'},
    {'name':'Engelsk-Dansk', 'url':'http://ordbogen.com/opslag.php?lookitup&word=%s&dict=enda'},
    {'name':'Dansk-Engelsk', 'url':'http://ordbogen.com/opslag.php?lookitup&word=%s&dict=daen'},
    {'name':'Wikipedia-Danish', 'url':'http://da.wikipedia.org/wiki/%s'},
    {'name':'Retskrivningsordbog', 'url':'http://www.ddoo.dk/orcapia.cms?lookitup&aid=109&mode=1&w=%s'},
    {'name':'Dansk Parlor', 'url':'http://www.parlor.dk/orcapia.cms?lookitup&w=%s&l=2'},
    {'name':'Ordbog over det danske sprog (ODS)', 'url':'http://ordnet.dk/ods/opslag?lookitup&opslag=%s'},
    {'name':'Engelsk-Dansk (Intertran)', 'url':'http://www.tranexp.com:2000/InterTran?lookitup&url=&topframe=no&type=text&text=%s&from=eng&to=dan'},
    {'name':'Ideomordbogen', 'url':'http://www.idiomordbogen.dk/idiom.php?lookitup&site=7&page=0&searchoption=contains&searchstring=%s&searchtype=basic'}
];

var meyshanlookup_dialog = false;
var meyshanlookup_box = '';
if(typeof(innerWidth) == 'undefined') var innerWidth = '900';
if(typeof(innerHeight) == 'undefined') var innerHeight = '550';

function meyshanlookup_buildBox() {
   var div = document.createElement('div');
   div.id = 'meyshanlookup-dialog-div';
   div.style.visibility = 'hidden';
   div.style.position = 'absolute';
   div.style.top = '0px';
   var title = document.createElement('div');
   title.className = 'ydlg-hd';
   title.innerHTML = 'Lookup';
   div.appendChild(title);
   var cnt = document.createElement('div');
   cnt.className = 'ydlg-bd';
   div.appendChild(cnt);
   var popup = document.createElement('iframe');
   popup.id = 'meyshanlookup-ResultBox';
   popup.style.width = (innerWidth - 110) + 'px';
   popup.style.height = (innerHeight - 120) + 'px';
   popup.style.borderWidth = '0px';
   cnt.appendChild(popup);
   document.body.appendChild(div);
   if(!meyshanlookup_dialog)
      meyshanlookup_dialog = new YAHOO.ext.BasicDialog( 'meyshanlookup-dialog-div', {modal: true,  width: innerWidth - 100,  height: innerHeight - 100,  shadow: true, autoTabs: false} );

    meyshanlookup_box = popup;
    return popup;
}

var meyshanlookup_tmp_url = '';
function meyshanlookup_lookup(site, words) {
   meyshanlookup_inbox = false;
    var meyshanlookup_box = document.getElementById('meyshanlookup-ResultBox');
    if (!meyshanlookup_box) meyshanlookup_box=meyshanlookup_buildBox();
    var div = document.getElementById('meyshanlookup-list');
    if(!div) {div = document.createElement('div'); document.body.appendChild(div);}
    
    // Get Text //
    if(!words || words == null || words == "") words = window.getSelection();
    if (!words || words == null || words == "") {
        meyshanlookup_dialog.hide();
        div.style.display = 'none';
        return;
    }
    words = String(words);
    words = words.replace(/(^\s+|\s+$)/g, '');

    // Kill HTML //
    words = words.replace(/"/g, "'");
    words = words.replace(/>/g, '&gt');
    words = words.replace(/</g, '&lt');

    // Hide on Big Selections //
    if (words.length > 40) {meyshanlookup_dialog.hide(); return;}

    // Truncate on Long Selections //
    if (words.length > 30) {words = words.substring(0,30);}

    meyshanlookup_box.src = meyshanlookup_url+'loading.gif';
    meyshanlookup_dialog.show();
    var pos = site.indexOf('%s');
    meyshanlookup_tmp_url = encodeURI(site.substr(0,pos) + words + site.substr(pos+2));
    setTimeout("document.getElementById('meyshanlookup-ResultBox').src = meyshanlookup_tmp_url;",1000);
    div.style.display = 'none';
}

var meyshanlookup_inbox = false;
var meyshanlookup_theselection = '';
function meyshanlookup_list(e) {
   try{ console.log(e); } catch(ex) {}
   if(meyshanlookup_inbox) {
      meyshanlookup_lookup(meyshanlookup_inbox);
      return true;
   }//end if meyshanlookup_inbox
   meyshanlookup_inbox = false;
   var meyshanlookup_box = document.getElementById('meyshanlookup-ResultBox');
   if(!meyshanlookup_box) meyshanlookup_box=meyshanlookup_buildBox();
   var div = document.getElementById('meyshanlookup-list');
   if(!div) {div = document.createElement('div'); document.body.appendChild(div);}
   if(window.getSelection() == meyshanlookup_theselection) {if(window.getSelection() != meyshanlookup_theselection) meyshanlookup_theselection = ''; return true;}
   if(!window.getSelection() || window.getSelection() == null || window.getSelection() == "" || window.getSelection().length > 40) {
      div.style.display = 'none';
      return true;
   }//end if ! selected
   div.style.display = 'block';
   div.id = 'meyshanlookup-list';
   div.style.backgroundColor = '#ccc';
   div.style.color = 'black';
   div.style.padding = '3px';
   div.style.position = 'absolute';
   div.style.textAlign = 'left';
   var x,y;
   if(e.offsetY) {x = e.offsetX; y = e.offsetY;}
   if(e.layerY) {x = e.layerX; y = e.layerY;}
   div.style.top = y + 'px';
   div.style.left = x + 'px';
   var txt = '<ul>';
   for(var i in meyshanlookup_sites) {
      if(meyshanlookup_sites[i] && meyshanlookup_sites[i].url && meyshanlookup_sites[i].name && meyshanlookup_sites[i].name != 'undefined')
         txt += '<li><a onmouseover="meyshanlookup_inbox = \''+meyshanlookup_sites[i].url+'\';" href="javascript:meyshanlookup_lookup(\''+meyshanlookup_sites[i].url+'\',\''+window.getSelection()+'\');" style="color:blue;">'+meyshanlookup_sites[i].name+'</a></li>';
   }//end for var i in sites
   txt += '</ul>';
   txt += '<a onmouseover="meyshanlookup_inbox = \'\';" style="display:block;text-align:right;" href="#" onclick="document.getElementById(\'meyshanlookup-list\').style.display = \'none\';return false;">close</a>';
   div.innerHTML = txt;
   meyshanlookup_theselection = window.getSelection()+'';
   return true;
}

//Attach events in both IE and FF
if(document.attachEvent)
   document.attachEvent("onmouseup",  meyshanlookup_list);
if(document.addEventListener)
   document.addEventListener("mouseup",   meyshanlookup_list, true);