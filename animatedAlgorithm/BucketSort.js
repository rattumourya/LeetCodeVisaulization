
// Copyright 2011 David Galles, University of San Francisco. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
// conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
// of conditions and the following disclaimer in the documentation and/or other materials
// provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY <COPYRIGHT HOLDER> ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those of the
// authors and should not be interpreted as representing official policies, either expressed
// or implied, of the University of San Francisco



function BucketSort(am, w, h)
{
	this.init(am,w,h);

}


var CANVAS_WIDTH = 720;
var CANVAS_HEIGHT = 1280;

var ARRAY_SIZE_SMALL = 10;

var ARRAY_ELEM_WIDTH_SMALL = 54;
var ARRAY_ELEM_HEIGHT_SMALL = 50;
var ARRAY_ELEM_START_X_SMALL =
  (CANVAS_WIDTH - ARRAY_SIZE_SMALL * ARRAY_ELEM_WIDTH_SMALL) / 2;

var ARRAY_ELEMENT_Y_SMALL = 300;
var ARRAY_LABEL_Y = ARRAY_ELEMENT_Y_SMALL - 60;

var POINTER_ARRAY_ELEM_WIDTH_SMALL = ARRAY_ELEM_WIDTH_SMALL;
var POINTER_ARRAY_ELEM_HEIGHT_SMALL = 50;
var POINTER_ARRAY_ELEM_START_X_SMALL = ARRAY_ELEM_START_X_SMALL;
var POINTER_ARRAY_ELEMENT_Y = 480;
var BUCKET_LABEL_Y = POINTER_ARRAY_ELEMENT_Y - 60;

var LINKED_ITEM_HEIGHT_SMALL = 50;
var LINKED_ITEM_WIDTH_SMALL = 44;

var LINKED_ITEM_Y_DELTA_SMALL = 52;
var LINKED_ITEM_POINTER_PERCENT_SMALL = 0.25;

var OUTPUT_ARRAY_Y = 660;
var OUTPUT_LABEL_Y = OUTPUT_ARRAY_Y - 60;
var OUTPUT_INDEX_GAP = 32;

var MAX_DATA_VALUE = 999;

var PANEL_MARGIN = 60;
var INFO_PANEL_WIDTH = CANVAS_WIDTH - PANEL_MARGIN * 2;
var INFO_PANEL_HEIGHT = 170;
var INFO_PANEL_Y = 160;
var INFO_LABEL_X = CANVAS_WIDTH / 2;
var INFO_LABEL_START_Y = INFO_PANEL_Y + 18;
var INFO_LABEL_LINE_HEIGHT = 22;

var STAGING_NODE_X = CANVAS_WIDTH / 2;
var STAGING_NODE_Y = ARRAY_ELEMENT_Y_SMALL + 70;

var HIGHLIGHT_CIRCLE_START_X = STAGING_NODE_X;
var HIGHLIGHT_CIRCLE_START_Y = STAGING_NODE_Y + 60;

var CODE_PANEL_WIDTH = CANVAS_WIDTH - PANEL_MARGIN * 2;
var CODE_PANEL_HEIGHT = 280;
var CODE_PANEL_Y =
  CANVAS_HEIGHT - PANEL_MARGIN - CODE_PANEL_HEIGHT / 2;
var CODE_TITLE_Y = CODE_PANEL_Y - CODE_PANEL_HEIGHT / 2 + 32;
var CODE_START_Y = CODE_PANEL_Y - CODE_PANEL_HEIGHT / 2 + 90;
var CODE_LINE_HEIGHT = 24;
var CODE_SECTION_GAP = 28;
var CODE_FONT = "bold 18";
var CODE_COLUMNS = [160, 460];
var CODE_LAYOUT = [0, 0, 1];

var INPUT_FILL_COLOR = "#edf2fb";
var INPUT_FINAL_COLOR = "#a9def9";
var BUCKET_FILL_COLOR = "#f8f9fa";
var OUTPUT_FILL_COLOR = "#f1f3f5";
var OUTPUT_FINAL_COLOR = "#90e0ef";
var PANEL_BORDER_COLOR = "#1d3557";
var PANEL_TEXT_COLOR = "#1d3557";
var PANEL_SUBTEXT_COLOR = "#2b2d42";
var CODE_TEXT_COLOR = "#1d3557";

var CODE_SECTIONS = [
  {
    lines: [
      "void bucketSort(int[] arr) {",
      "  List<Integer>[] buckets = initBuckets(arr.length);",
      "  scatter(arr, buckets);",
      "  gather(arr, buckets);",
      "}",
    ],
  },
  {
    lines: [
      "void scatter(int[] arr, List<Integer>[] buckets) {",
      "  for (int value : arr) {",
      "    int index = value * buckets.length / (MAX + 1);",
      "    insertSorted(buckets[index], value);",
      "  }",
      "}",
    ],
  },
  {
    lines: [
      "void gather(int[] arr, List<Integer>[] buckets) {",
      "  int write = 0;",
      "  for (List<Integer> bucket : buckets) {",
      "    for (int value : bucket) {",
      "      arr[write++] = value;",
      "    }",
      "  }",
      "}",
    ],
  },
];


BucketSort.prototype = new Algorithm();
BucketSort.prototype.constructor = BucketSort;
BucketSort.superclass = Algorithm.prototype;

BucketSort.prototype.init = function(am, w, h)
{
	var sc = BucketSort.superclass;
	var fn = sc.init;
	fn.call(this,am, w, h);
	this.addControls();
        this.pointer_array_elem_y_small = POINTER_ARRAY_ELEMENT_Y;

	this.nextIndex = 0;
	this.setup();	
}



BucketSort.prototype.addControls =  function()
{
	this.resetButton = addControlToAlgorithmBar("Button", "Randomize List");
	this.resetButton.onclick = this.resetCallback.bind(this);

	this.bucketSortButton = addControlToAlgorithmBar("Button", "Bucket Sort");
	this.bucketSortButton.onclick = this.bucketSortCallback.bind(this);

}



BucketSort.prototype.createStaticLayout = function()
{
        this.infoPanelID = this.nextIndex++;
        this.cmd("CreateRectangle", this.infoPanelID, "", INFO_PANEL_WIDTH, INFO_PANEL_HEIGHT, CANVAS_WIDTH / 2, INFO_PANEL_Y);
        this.cmd("SetForegroundColor", this.infoPanelID, PANEL_BORDER_COLOR);
        this.cmd("SetBackgroundColor", this.infoPanelID, BUCKET_FILL_COLOR);

        var infoTitleID = this.nextIndex++;
        this.cmd("CreateLabel", infoTitleID, "Bucket Sort Overview", CANVAS_WIDTH / 2, INFO_PANEL_Y - INFO_PANEL_HEIGHT / 2 + 28, 0);
        this.cmd("SetTextStyle", infoTitleID, "bold 26");
        this.cmd("SetForegroundColor", infoTitleID, PANEL_TEXT_COLOR);

        var infoLines = [
                "Distribute values into linked-list buckets using a scaled index.",
                "Buckets stay sorted so we can concatenate into the output array.",
        ];
        var infoStaticStart = INFO_PANEL_Y - 34;
        for (var line = 0; line < infoLines.length; line++)
        {
                var infoLineID = this.nextIndex++;
                this.cmd("CreateLabel", infoLineID, infoLines[line], INFO_LABEL_X, infoStaticStart + line * INFO_LABEL_LINE_HEIGHT, 0);
                this.cmd("SetForegroundColor", infoLineID, PANEL_SUBTEXT_COLOR);
                this.cmd("SetTextStyle", infoLineID, "18px");
        }

        this.arrayLabelID = this.nextIndex++;
        this.cmd("CreateLabel", this.arrayLabelID, "Input Array", CANVAS_WIDTH / 2, ARRAY_LABEL_Y, 0);
        this.cmd("SetTextStyle", this.arrayLabelID, "bold 26");
        this.cmd("SetForegroundColor", this.arrayLabelID, PANEL_TEXT_COLOR);

        this.bucketLabelID = this.nextIndex++;
        this.cmd("CreateLabel", this.bucketLabelID, "Buckets", CANVAS_WIDTH / 2, BUCKET_LABEL_Y, 0);
        this.cmd("SetTextStyle", this.bucketLabelID, "bold 26");
        this.cmd("SetForegroundColor", this.bucketLabelID, PANEL_TEXT_COLOR);

        this.outputLabelID = this.nextIndex++;
        this.cmd("CreateLabel", this.outputLabelID, "Output Array", CANVAS_WIDTH / 2, OUTPUT_LABEL_Y, 0);
        this.cmd("SetTextStyle", this.outputLabelID, "bold 26");
        this.cmd("SetForegroundColor", this.outputLabelID, PANEL_TEXT_COLOR);

        this.codeBackgroundID = this.nextIndex++;
        this.cmd("CreateRectangle", this.codeBackgroundID, "", CODE_PANEL_WIDTH, CODE_PANEL_HEIGHT, CANVAS_WIDTH / 2, CODE_PANEL_Y);
        this.cmd("SetForegroundColor", this.codeBackgroundID, PANEL_BORDER_COLOR);
        this.cmd("SetBackgroundColor", this.codeBackgroundID, BUCKET_FILL_COLOR);

        this.codeTitleID = this.nextIndex++;
        this.cmd("CreateLabel", this.codeTitleID, "Bucket Sort (pseudocode)", CANVAS_WIDTH / 2, CODE_TITLE_Y, 0);
        this.cmd("SetTextStyle", this.codeTitleID, "bold 24");
        this.cmd("SetForegroundColor", this.codeTitleID, PANEL_TEXT_COLOR);

        this.codeIDs = [];
        var columnHeights = [];
        for (var c = 0; c < CODE_COLUMNS.length; c++)
        {
                columnHeights[c] = CODE_START_Y;
        }

        for (var sectionIndex = 0; sectionIndex < CODE_SECTIONS.length; sectionIndex++)
        {
                var section = CODE_SECTIONS[sectionIndex];
                var columnIndex = CODE_LAYOUT[sectionIndex];
                var columnX = CODE_COLUMNS[columnIndex];
                var currentY = columnHeights[columnIndex];
                for (var codeLine = 0; codeLine < section.lines.length; codeLine++)
                {
                        var codeLineID = this.nextIndex++;
                        this.cmd("CreateLabel", codeLineID, section.lines[codeLine], columnX, currentY, 0);
                        this.cmd("SetTextStyle", codeLineID, CODE_FONT);
                        this.cmd("SetForegroundColor", codeLineID, CODE_TEXT_COLOR);
                        currentY += CODE_LINE_HEIGHT;
                }
                columnHeights[columnIndex] = currentY + CODE_SECTION_GAP;
        }
}

BucketSort.prototype.setup = function()
{
        this.arrayData = new Array(ARRAY_SIZE_SMALL);
        this.arrayRects= new Array(ARRAY_SIZE_SMALL);
        this.linkedListRects = new Array(ARRAY_SIZE_SMALL);
        this.linkedListData = new Array(ARRAY_SIZE_SMALL);
        this.upperIndices = new Array(ARRAY_SIZE_SMALL);
        this.lowerIndices = new Array(ARRAY_SIZE_SMALL);
        this.outputRects = new Array(ARRAY_SIZE_SMALL);
        this.outputIndexLabels = new Array(ARRAY_SIZE_SMALL);
        this.outputData = new Array(ARRAY_SIZE_SMALL);
        this.commands = new Array();
        this.oldData = new Array(ARRAY_SIZE_SMALL);

        this.createStaticLayout();

        for (var i = 0; i < ARRAY_SIZE_SMALL; i++)
        {
                var nextID = this.nextIndex++;
                this.arrayData[i] = Math.floor(Math.random()*MAX_DATA_VALUE);
                this.oldData[i] = this.arrayData[i];
                this.cmd("CreateRectangle", nextID, this.arrayData[i], ARRAY_ELEM_WIDTH_SMALL, ARRAY_ELEM_HEIGHT_SMALL, ARRAY_ELEM_START_X_SMALL + i *ARRAY_ELEM_WIDTH_SMALL, ARRAY_ELEMENT_Y_SMALL);
                this.cmd("SetForegroundColor", nextID, PANEL_BORDER_COLOR);
                this.cmd("SetBackgroundColor", nextID, INPUT_FILL_COLOR);
                this.arrayRects[i] = nextID;

                nextID = this.nextIndex++;
                this.cmd("CreateRectangle", nextID, "", POINTER_ARRAY_ELEM_WIDTH_SMALL, POINTER_ARRAY_ELEM_HEIGHT_SMALL, POINTER_ARRAY_ELEM_START_X_SMALL + i *POINTER_ARRAY_ELEM_WIDTH_SMALL, this.pointer_array_elem_y_small);
                this.cmd("SetForegroundColor", nextID, PANEL_BORDER_COLOR);
                this.cmd("SetBackgroundColor", nextID, BUCKET_FILL_COLOR);
                this.linkedListRects[i] = nextID;
                this.cmd("SetNull", this.linkedListRects[i], 1);

                nextID = this.nextIndex++;
                this.upperIndices[i] = nextID;
                this.cmd("CreateLabel",nextID,  i,  ARRAY_ELEM_START_X_SMALL + i *ARRAY_ELEM_WIDTH_SMALL, ARRAY_ELEMENT_Y_SMALL+ ARRAY_ELEM_HEIGHT_SMALL + 24);
                this.cmd("SetForegroundColor", nextID, PANEL_TEXT_COLOR);
                this.cmd("SetTextStyle", nextID, "bold 16");

                nextID = this.nextIndex++;
                this.lowerIndices[i] = nextID;
                this.cmd("CreateLabel", nextID, i, POINTER_ARRAY_ELEM_START_X_SMALL + i *POINTER_ARRAY_ELEM_WIDTH_SMALL, this.pointer_array_elem_y_small + POINTER_ARRAY_ELEM_HEIGHT_SMALL + 24);
                this.cmd("SetForegroundColor", nextID, PANEL_TEXT_COLOR);
                this.cmd("SetTextStyle", nextID, "bold 16");

                nextID = this.nextIndex++;
                this.cmd("CreateRectangle", nextID, "", ARRAY_ELEM_WIDTH_SMALL, ARRAY_ELEM_HEIGHT_SMALL, ARRAY_ELEM_START_X_SMALL + i *ARRAY_ELEM_WIDTH_SMALL, OUTPUT_ARRAY_Y);
                this.cmd("SetForegroundColor", nextID, PANEL_BORDER_COLOR);
                this.cmd("SetBackgroundColor", nextID, OUTPUT_FILL_COLOR);
                this.outputRects[i] = nextID;

                nextID = this.nextIndex++;
                this.outputIndexLabels[i] = nextID;
                this.cmd("CreateLabel", nextID, i, ARRAY_ELEM_START_X_SMALL + i *ARRAY_ELEM_WIDTH_SMALL, OUTPUT_ARRAY_Y + ARRAY_ELEM_HEIGHT_SMALL / 2 + OUTPUT_INDEX_GAP);
                this.cmd("SetForegroundColor", nextID, PANEL_TEXT_COLOR);
                this.cmd("SetTextStyle", nextID, "bold 16");

                this.outputData[i] = null;
        }
        this.animationManager.StartNewAnimation(this.commands);
        this.animationManager.skipForward();
        this.animationManager.clearHistory();

}

BucketSort.prototype.bucketSortCallback = function(event)
{
        var savedIndex = this.nextIndex;
        this.commands = new Array();
        this.linkedListData = new Array(ARRAY_SIZE_SMALL);
        var i;
        for (i= 0; i < ARRAY_SIZE_SMALL; i++)
        {
                this.cmd("SetBackgroundColor", this.arrayRects[i], INPUT_FILL_COLOR);
                this.cmd("SetText", this.outputRects[i], "");
                this.cmd("SetBackgroundColor", this.outputRects[i], OUTPUT_FILL_COLOR);
                this.outputData[i] = null;
                this.cmd("SetNull", this.linkedListRects[i], 1);
        }
        for (i= 0; i < ARRAY_SIZE_SMALL; i++)
        {
                var labelID = this.nextIndex++;
                var label2ID = this.nextIndex++;
                var label3ID = this.nextIndex++;
                var label4ID = this.nextIndex++;
                var node  = new LinkedListNode(this.arrayData[i],this.nextIndex++, STAGING_NODE_X, STAGING_NODE_Y);
                this.cmd("CreateLinkedList", node.graphicID, "", LINKED_ITEM_WIDTH_SMALL, LINKED_ITEM_HEIGHT_SMALL, STAGING_NODE_X, STAGING_NODE_Y);
                this.cmd("SetNull", node.graphicID, 1);

                this.cmd("CreateLabel", labelID, this.arrayData[i], ARRAY_ELEM_START_X_SMALL + i *ARRAY_ELEM_WIDTH_SMALL, ARRAY_ELEMENT_Y_SMALL);
                this.cmd("SetText", node.graphicID, "");
                this.cmd("Move", labelID, STAGING_NODE_X, STAGING_NODE_Y);
                this.cmd("Step");
                this.cmd("SetText", node.graphicID, this.arrayData[i]);
                this.cmd("Delete", labelID);
                var index  = Math.floor((this.arrayData[i]  * ARRAY_SIZE_SMALL) / (MAX_DATA_VALUE + 1));

                this.cmd("CreateLabel", labelID, "Bucket index =",  INFO_LABEL_X, INFO_LABEL_START_Y, 0);
                this.cmd("CreateLabel", label2ID, "value * bucketCount / (MAX + 1)",  INFO_LABEL_X, INFO_LABEL_START_Y + INFO_LABEL_LINE_HEIGHT, 0);
                this.cmd("CreateLabel", label3ID, "("+ String(this.arrayData[i]) + " * " + String(ARRAY_SIZE_SMALL) + ") / " + String(MAX_DATA_VALUE+1) + " = ", INFO_LABEL_X, INFO_LABEL_START_Y + 2 * INFO_LABEL_LINE_HEIGHT, 0);
                this.cmd("CreateLabel", label4ID, index, INFO_LABEL_X, INFO_LABEL_START_Y + 3 * INFO_LABEL_LINE_HEIGHT);
                this.cmd("SetForegroundColor", labelID, PANEL_SUBTEXT_COLOR);
                this.cmd("SetForegroundColor", label2ID, PANEL_SUBTEXT_COLOR);
                this.cmd("SetForegroundColor", label3ID, PANEL_SUBTEXT_COLOR);
                this.cmd("SetForegroundColor", label4ID, PANEL_TEXT_COLOR);


                var highlightCircle = this.nextIndex++;
                this.cmd("CreateHighlightCircle", highlightCircle, "#0000FF",  HIGHLIGHT_CIRCLE_START_X, HIGHLIGHT_CIRCLE_START_Y);
                this.cmd("Move", highlightCircle, POINTER_ARRAY_ELEM_START_X_SMALL + index *POINTER_ARRAY_ELEM_WIDTH_SMALL, this.pointer_array_elem_y_small + POINTER_ARRAY_ELEM_HEIGHT_SMALL);
                this.cmd("Step");
                this.cmd("Delete", labelID);
                this.cmd("Delete", label2ID);
                this.cmd("Delete", label3ID);
                this.cmd("Delete", label4ID);
                this.cmd("Delete", highlightCircle);



                if (this.linkedListData[index] == null)
                {
                        this.linkedListData[index] = node;
                        this.cmd("Connect", this.linkedListRects[index], node.graphicID);
                        this.cmd("SetNull",this.linkedListRects[index], 0);

                        node.x = POINTER_ARRAY_ELEM_START_X_SMALL + index *POINTER_ARRAY_ELEM_WIDTH_SMALL;
                        node.y = this.pointer_array_elem_y_small - LINKED_ITEM_Y_DELTA_SMALL;
                        this.cmd("Move", node.graphicID, node.x, node.y);
                }
                else
                {
                        var tmp = this.linkedListData[index];
                        this.cmd("SetHighlight", tmp.graphicID, 1);
                        this.cmd("SetHighlight", node.graphicID, 1);
                        this.cmd("Step");
                        this.cmd("SetHighlight", tmp.graphicID, 0);
                        this.cmd("SetHighlight", node.graphicID, 0);

                        if (Number(tmp.data) >= Number(node.data))
                        {
                                this.cmd("Disconnect", this.linkedListRects[index], this.linkedListData[index].graphicID);
                                node.next = tmp;
                                this.cmd("Connect", this.linkedListRects[index], node.graphicID);
                                this.cmd("Connect", node.graphicID, tmp.graphicID);
                                this.cmd("SetNull",node.graphicID, 0);
                                this.linkedListData[index] = node;
                                this.cmd("Connect", this.linkedListRects[index], node.graphicID);

                        }
                        else
                        {
                                if (tmp.next != null)
                                {
                                        this.cmd("SetHighlight", tmp.next.graphicID, 1);
                                        this.cmd("SetHighlight", node.graphicID, 1);
                                        this.cmd("Step");
                                        this.cmd("SetHighlight", tmp.next.graphicID, 0);
                                        this.cmd("SetHighlight", node.graphicID, 0);
                                }

                                while (tmp.next != null && Number(tmp.next.data) < Number(node.data))
                                {
                                        tmp = tmp.next;
                                        if (tmp.next != null)
                                        {
                                                this.cmd("SetHighlight", tmp.next.graphicID, 1);
                                                this.cmd("SetHighlight", node.graphicID, 1);
                                                this.cmd("Step");
                                                this.cmd("SetHighlight", tmp.next.graphicID, 0);
                                                this.cmd("SetHighlight", node.graphicID, 0);
                                        }
                                }
                                if (tmp.next != null)
                                {
                                        this.cmd("Disconnect", tmp.graphicID, tmp.next.graphicID);
                                        this.cmd("Connect", node.graphicID, tmp.next.graphicID);
                                        this.cmd("SetNull",node.graphicID, 0);
                                }
                                else
                                {
                                        this.cmd("SetNull",tmp.graphicID, 0);
                                }
                                node.next = tmp.next;
                                tmp.next = node;
                                this.cmd("Connect", tmp.graphicID, node.graphicID);
                        }
                        tmp = this.linkedListData[index];
                        var startX = POINTER_ARRAY_ELEM_START_X_SMALL + index *POINTER_ARRAY_ELEM_WIDTH_SMALL;
                        var startY =  this.pointer_array_elem_y_small - LINKED_ITEM_Y_DELTA_SMALL;
                        while (tmp != null)
                        {
                                tmp.x = startX;
                                tmp.y = startY;
                                this.cmd("Move", tmp.graphicID, tmp.x, tmp.y);
                                startY = startY - LINKED_ITEM_Y_DELTA_SMALL;
                                tmp = tmp.next;
                        }
                }
                this.cmd("Step");
        }
        var insertIndex = 0;
        for (i = 0; i < ARRAY_SIZE_SMALL; i++)
        {
                var current = this.linkedListData[i];
                while (current != null)
                {
                        var nextNode = current.next;
                        var moveLabelID = this.nextIndex++;
                        this.cmd("SetText", current.graphicID, "");
                        this.cmd("CreateLabel", moveLabelID, current.data, current.x, current.y);
                        var targetX = ARRAY_ELEM_START_X_SMALL + insertIndex *ARRAY_ELEM_WIDTH_SMALL;
                        this.cmd("Move", moveLabelID,  targetX, OUTPUT_ARRAY_Y);
                        this.cmd("Step");
                        this.cmd("Delete", moveLabelID);
                        this.cmd("SetText", this.outputRects[insertIndex], current.data);
                        this.cmd("SetBackgroundColor", this.outputRects[insertIndex], OUTPUT_FINAL_COLOR);
                        this.cmd("Delete", current.graphicID);
                        if (nextNode != null)
                        {
                                this.cmd("Connect", this.linkedListRects[i], nextNode.graphicID);
                        }
                        else
                        {
                                this.cmd("SetNull", this.linkedListRects[i], 1);
                        }
                        this.outputData[insertIndex] = current.data;
                        this.arrayData[insertIndex] = current.data;
                        this.cmd("SetText", this.arrayRects[insertIndex], current.data);
                        this.cmd("SetBackgroundColor", this.arrayRects[insertIndex], INPUT_FINAL_COLOR);
                        insertIndex++;
                        current = nextNode;
                }
                this.linkedListData[i] = null;


        }
        this.animationManager.StartNewAnimation(this.commands);
        this.nextIndex = savedIndex;
}

BucketSort.prototype.randomizeArray = function()
{
        this.commands = new Array();
        for (var i = 0; i < ARRAY_SIZE_SMALL; i++)
        {
                this.arrayData[i] =  Math.floor(1 + Math.random()*MAX_DATA_VALUE);
                this.oldData[i] = this.arrayData[i];
                this.outputData[i] = null;
                this.cmd("SetText", this.arrayRects[i], this.arrayData[i]);
                this.cmd("SetBackgroundColor", this.arrayRects[i], INPUT_FILL_COLOR);
                this.cmd("SetText", this.outputRects[i], "");
                this.cmd("SetBackgroundColor", this.outputRects[i], OUTPUT_FILL_COLOR);
                this.cmd("SetNull", this.linkedListRects[i], 1);
        }



        this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	
}



// We want to (mostly) ignore resets, since we are disallowing undoing 
BucketSort.prototype.reset = function()
{
        this.commands = new Array();
        for (var i = 0; i < ARRAY_SIZE_SMALL; i++)
        {
                this.arrayData[i] = this.oldData[i];
                this.outputData[i] = null;
                this.cmd("SetText", this.arrayRects[i], this.arrayData[i]);
                this.cmd("SetBackgroundColor", this.arrayRects[i], INPUT_FILL_COLOR);
                this.cmd("SetText", this.outputRects[i], "");
                this.cmd("SetBackgroundColor", this.outputRects[i], OUTPUT_FILL_COLOR);
                this.cmd("SetNull", this.linkedListRects[i], 1);
        }
}


BucketSort.prototype.resetCallback = function(event)
{
	this.randomizeArray();
}



BucketSort.prototype.disableUI = function(event)
{
	this.resetButton.disabled = true;
	this.bucketSortButton.disabled = true;
}
BucketSort.prototype.enableUI = function(event)
{
	this.resetButton.disabled = false;
	this.bucketSortButton.disabled = false;
}

function LinkedListNode(label, id, x, y)
{
	this.data = label;
	this.graphicID = id;
	this.x = x;
	this.y = y;
}

var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new BucketSort(animManag, canvas.width, canvas.height);
}