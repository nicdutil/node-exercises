/*! Copyright 2011 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// Modifications by Infocinc , 2014 
*/

function BarGraph(ctx) {

    // Private properties and methods
    var that = this;
    var startArr;
    var endArr;
    var looping = false;
    var barMax = 0;

    // Loop method adjusts the height of bar and redraws if neccessary
    var loop = function() {

        var delta;
        var animationComplete = true;
        var paintFlag;
        // Boolean to prevent update function from looping if already looping
        looping = true;

        if ($('#excel-photo').css('display') === 'none') {
            paintFlag = $('#screen-services').isOnScreen();
        } else {
            paintFlag = $('#excel-photo').isOnScreen();
        }

        if (!paintFlag) {
            setTimeout(loop, that.animationInterval / that.animationSteps);
            return;
        }

        // For each bar
        for (var i = 0; i < endArr.length; i += 1) {
            // Change the current bar height toward its target height
            delta = (endArr[i] - startArr[i]) / that.animationSteps;
            that.curArr[i] += delta;
            // If any change is made then flip a switch
            if (delta > 0.01) {
                animationComplete = false;
            }
        }

        // If no change was made to any bars then we are done
        if (animationComplete) {
            looping = false;
        } else {
            // Draw and call loop again
            draw(that.curArr);
            this.timerId = setTimeout(loop, that.animationInterval / that.animationSteps);
        }
    };

    // Draw method updates the canvas with the current display

    var draw = function(arr) {

        var numOfBars = arr.length,
            barWidth,
            barHeight,
            border = 2,
            ratio,
            maxBarHeight,
            largestValue,
            graphAreaX = 0,
            graphAreaY = 0,
            graphAreaWidth = that.width,
            graphAreaHeight = that.height,
            i;


        // Draw the background color
        ctx.fillStyle = that.backgroundColor;
        ctx.fillRect(0, 0, that.width, that.height);

        // If x axis labels exist then make room    
        if (that.xAxisLabelArr.length) {
            graphAreaHeight -= 40;
        }

        // Calculate dimensions of the bar
        if (that.orientation === 'horizontal') {
            barWidth = graphAreaWidth / numOfBars - that.margin * 2;
            maxBarHeight = graphAreaHeight - 25;
        } else {
            barWidth = graphAreaHeight / numOfBars - that.margin * 2;
            maxBarHeight = graphAreaWidth - 40;
        }

        // Determine the largest value in the bar array
        var largestValue = barMax = Math.max.apply(Math, arr);
        // For each bar
        for (i = 0; i < arr.length; i += 1) {

            // Set the ratio of current bar compared to the maximum
            if (that.maxValue) {
                ratio = arr[i] / that.maxValue;
            } else {
                ratio = arr[i] / largestValue;
            }

            barHeight = ratio * maxBarHeight;

            if (barHeight > border * 2) {
                ctx.fillStyle = that.colors[i % that.colors.length];


                if (that.orientation === 'horizontal') {
                    ctx.fillRect(that.margin + i * that.width / numOfBars + border,
                        graphAreaHeight - barHeight + border,
                        barWidth - border * 2,
                        barHeight - border * 2);
                } else {
                    ctx.fillRect(15,
                        that.margin + i * that.height / numOfBars,
                        barHeight,
                        barWidth);
                }
            }

            // Write bar value
            ctx.fillStyle = "#333";
            ctx.font = "bold 12px sans-serif";
            ctx.textAlign = "center";
            // Use try / catch to stop IE 8 from going to error town
            try {
                if (that.orientation === 'horizontal') {
                    ctx.fillText(parseInt(arr[i], 10),
                        i * that.width / numOfBars + (that.width / numOfBars) / 2,
                        graphAreaHeight - barHeight - 10);
                } else {
                    ctx.fillText(parseInt(arr[i], 10),
                        barHeight + 25,
                        i * that.height / numOfBars + (that.height / numOfBars) / 2,
                        graphAreaWidth - barHeight - 10);
                }
            } catch (ex) {}

            // Draw bar label if it exists
            if (that.xAxisLabelArr[i]) {

                // Use try / catch to stop IE 8 from going to error town

                ctx.fillStyle = "#333";
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                try {
                    if (that.orientation === 'horizontal') {
                        ctx.fillText(that.xAxisLabelArr[i],
                            i * that.width / numOfBars + (that.width / numOfBars) / 2,
                            that.height - 10);
                    } else {
                        ctx.fillText(that.xAxisLabelArr[i], 5,
                            i * that.height / numOfBars + (that.height / numOfBars) / 2,
                            that.width - 10);
                    }
                } catch (ex) {}
            }
        }
    };

    // Public properties and methods
    this.width;
    this.height;
    this.timerId;
    this.maxValue;
    this.margin = 5;
    this.colors = ["#354774", "#C0392B", "#27AE60", "#E5C454"];
    this.curArr = [];
    this.backgroundColor = "#fff";
    this.xAxisLabelArr = [];
    this.yAxisLabelArr = [];
    this.animationInterval = 400;
    this.animationSteps = 20;
    this.orientation;
    this.interrupt = 'false';

    // Update method sets the end bar array and starts the animation
    this.update = function(newArr) {
        // If length of target and current array is different 
        if (that.curArr.length !== newArr.length) {
            that.curArr = newArr;
            draw(newArr);
        } else {
            if (!looping) {
                startArr = that.curArr;
                endArr = newArr;
                loop();
            }
        }
    };
}
