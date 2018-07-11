// ==UserScript==
// @name           Article beginnings at dobreprogramy.pl
// @name:pl        Początki artykułów na dobreprogramy.pl
// @description    This script downloads and shows the beginning of all articles linked to from the main page or the publications list at dobreprogramy.pl.
// @description:pl Ten skrypt pobiera i pokazuje początki wszystkich artykułów zalinkowanych ze strony głównej lub listy publikacji na stronie dobreprogramy.pl.
// @version        1
// @license        GPL-3.0
// @grant          none
// @updateURL      https://openuserjs.org/meta/super_max2/article_beginnings_dp.meta.js
// @include        https://dobreprogramy.pl/
// @include        https://www.dobreprogramy.pl/
// @include        https://www.dobreprogramy.pl/Aktualnosci,*
// @include        https://dobreprogramy.pl/Aktualnosci,*
// ==/UserScript==

// ==OpenUserJS==
// @author super_max2
// ==/OpenUserJS==

/*
Copyright (C) 2018 Maksymilian Graczyk.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const MAX_NUMBER_OF_WORDS = 40;

function addArticleBeginning(articleBlock, beginningText)
{
    var paragraph = document.createElement("p");
    paragraph.innerHTML = beginningText;
    articleBlock.appendChild(paragraph);
}

var articleBlocks = document.getElementsByClassName("span-6");
for (var i = 0; i < articleBlocks.length; i++)
{
    var header = articleBlocks[i].getElementsByTagName("header")[0];
    var link = header.getElementsByTagName("a")[0];
    var request = new XMLHttpRequest();
    var url = link.href;

    request.onreadystatechange = function() {
        if (this.readyState === 4)
        {
            if (this.status === 200)
            {
                try
                {
                    var domParser = new DOMParser();
                    var obtainedDocument = domParser.parseFromString(this.responseText, "text/html");

                    var contentDiv = obtainedDocument.getElementById("phContent_divMetaBody");
                    //PL: Jeśli pobrany artykuł pochodzi z blogów, contentDiv będzie miał wartość null.
                    //EN: If a downloaded article comes from the blogs, the value of contentDiv will be null.
                    if (contentDiv === null)
                    {
                        var article = obtainedDocument.getElementsByTagName("article")[0];
                        contentDiv = article.getElementsByClassName("entry-content")[0];
                    }
                    var paragraphs = contentDiv.getElementsByTagName("p");

                    var j = 0;

                    for (; j < paragraphs.length; j++)
                    {
                        if (paragraphs[j].className === "" || paragraphs[j].className === undefined) break;
                    }

                    var firstParagraphText = paragraphs[j].innerText;
                    var firstParagraphWords = firstParagraphText.split(/\s+/);

                    var articleBeginning = "";

                    if (firstParagraphWords.length > MAX_NUMBER_OF_WORDS)
                    {
                        for (var k = 0; k < MAX_NUMBER_OF_WORDS; k++)
                        {
                            articleBeginning += firstParagraphWords[k] + " ";
                        }
                    }
                    else articleBeginning = firstParagraphText + " ";

                    articleBeginning += "(...)";

                    addArticleBeginning(articleBlocks[i], articleBeginning);
                }
                catch (error)
                {
                    addArticleBeginning(articleBlocks[i], "<i>Nie udało się pobrać początku artykułu.</i>");
                }
            }
            else addArticleBeginning(articleBlocks[i], "<i>Nie udało się pobrać początku artykułu.</i>");
        }
    };
    request.open("GET", url, false);
    request.send();
}
