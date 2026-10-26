	// imported by pptx2pdf.ps1
	const lessThan=String.fromCharCode(60)
	const greaterThan=String.fromCharCode(62)
	const backslash=String.fromCharCode(92)

	const LINEPATH=true;
	const TEXTPATH=false;
	const HREFID="sdpath";
	/*
	const prefix='\
<defs>\
    !-- A marker to be used as an arrowhead -->\
    '+lessThan+'marker id="arrow_black" viewBox="-8 0 3 10" refX="1" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="4" orient="auto"'+greaterThan+'\
        '+lessThan+'polygon points="-8,0 3,5 -8,10" style="fill:rgb(0, 0, 0);"'+greaterThan+lessThan+'/polygon'+greaterThan+'\
    '+lessThan+'/marker'+greaterThan+'\
	
	
'+lessThan+'/defs'+greaterThan;
*/
	function colours() {
		clrs="black:rgb(0,0,0);purple:purple;red:red;green:green;blue:blue;yellow:yellow;pink:pink;orange:orange;grey:grey;white:white;lightblue:lightblue".split(";")
		template=lessThan+'marker id="arrow_black" viewBox="-8 0 3 10" refX="1" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="4" orient="auto"'+greaterThan+'\
        '+lessThan+'polygon points="-8,0 3,5 -8,10" style="fill:rgb(0, 0, 0);"'+greaterThan+lessThan+'/polygon'+greaterThan+'\
    '+lessThan+'/marker'+greaterThan
		out=""
		for (let i = 0; i !== clrs.length; i++) {
			let colourRGB=clrs[i].split(":")
			t=template.replace("black",colourRGB[0]).replace("rgb(0, 0, 0)",colourRGB[1])
			out+=t
		}
		return out
	}
	
	const prefix=lessThan+"defs"+greaterThan+colours()+lessThan+"/defs"+greaterThan


	function setupSeqDia(id,initTxt,options) {
		// Create the main container div
		const containerDiv = document.createElement('div');

		// Create the textarea element
		const textarea = document.createElement('textarea');
		textarea.id = id; //'seqDiag1';
		textarea.rows = 10;
		textarea.cols = 80;
		textarea.placeholder = 'Enter your UML here...';
		textarea.textContent = initTxt; //'INITTEXT';

		// Create the line break element
		const lineBreak = document.createElement('br');

		// Create the button element
		const button = document.createElement('button');
		button.textContent = 'Generate SVG';
		button.onclick = function() {
			generateSVG(id); //'seqDiag1');
		};



		// Buttons don't work inside moodle quizzes
		const div = document.createElement('div');

		// Set the styles
		div.style.display = 'inline-block';
		div.style.color = '#444';
		div.style.border = '1px solid #CCC';
		div.style.background = '#DDD';
		div.style.boxShadow = '0 0 5px -1px rgba(0,0,0,0.2)';
		div.style.cursor = 'pointer';
		div.style.verticalAlign = 'middle';
		div.style.maxWidth = '100px';
		div.style.padding = '5px';
		div.style.textAlign = 'center';

		// Set the text content
		div.textContent = 'Generate SVG';

		// Set the onclick event
		div.onclick = function() {
			generateSVG(id); //'seqDiag1');
		};
        
		// Append the div to the desired parent element
		//document.body.appendChild(div);





		// Create the outer div for overflow
		const outerDiv = document.createElement('div');
		outerDiv.id = 'outer_'+id; //seqDiag1';
		//outerDiv.style.overflow = 'auto';
        outerDiv.style.overflow = 'none';
		outerDiv.style.maxHeight = '400px';

		// Create the inner div for output
		const outputDiv = document.createElement('div');
		outputDiv.id = 'output_'+id; //seqDiag1';

		// Append the elements to the container div
		outerDiv.appendChild(outputDiv);
		containerDiv.appendChild(textarea);
		containerDiv.appendChild(lineBreak);
		if (options.button) {
			containerDiv.appendChild(button);
		} else {
			containerDiv.appendChild(div);
		}
		containerDiv.appendChild(outerDiv);

		// Append the container div to the desired parent element
		//document.body.appendChild(containerDiv);
		document.currentScript.after(containerDiv);
        generateSVG(id);
	}


function fromMIME(mimeStr) {
    return decodeURIComponent((atob(mimeStr)));
}

function isLessThan(x, y) {
    return Math.sign(x - y) === -1;
}


		// moodle likes to replace chars
		//const regex = new RegExp('^ *(&?) *([^ \\(-]) *(\\(?[0-9]*\\)?) *-\\[?#?([^\\]]*)\\]?(-?)> *(\\(?[0-9]*\\)?) *([^ :\\)]) *(:?.*)$');
		//^ *(&?) *([^ \(-]) *(\(?[0-9]*\)?) *-\[?#?([^\]^-]*)\]?(-?)> *(\(?[0-9]*\)?) *([^ :\)]) *(:?.*)$
		
		//const regex = new RegExp(fromMIME("XiAqKCY/KSAqKFteIFwoLV0pICooXCg/WzAtOV0qXCk/KSAqLVxbPyM/KFteXF1eLV0qKVxdPygtPyk+ICooXCg/WzAtOV0qXCk/KSAqKFteIDpcKV0pICooOj8uKikk"))
		//		                 &        A         ( -5     )     -  [ #  blue     ]  -       >             (-50    )          B        : blah
		//const regex=new RegExp("(&?) *([^ \(-]) *((\([-0-9]*\))?) *-\\[?#?([^\]-]*)\]?(-?)"+greaterThan+" *((\([-0-9]*\))?) *([^ :\(]) *(:?.*)$")
		//                               ^(
		const b=backslash
		const srcReg="([^ "+b+"(-]+)"
		const dropReg="(|"+b+"([-0-9]+"+b+"))"
		//const arrowReg="-[^-]?#?([^"+b+"]-]*)[^-]?(-?)"+greaterThan
		//                 colouuuuuuuuuuuuuuur
		//              -   [  #red          ]    -   >
		const arrowReg="-(|[^-]#[^"+b+"]-]+[^-])(|-)"+greaterThan
		const regex=new RegExp("(&?) *"+srcReg+" *"+dropReg+" *"+arrowReg+" *"+dropReg+" *([^ :"+b+"(]+) *(:?.*)$")
		//const regex=new RegExp("(&?) *([^ "+b+"(-]) *("+b+"(?[-0-9]*"+b+")?) *-.?#?([^"+b+"]-]*).?(-?)"+greaterThan+" *("+b+"(?[-0-9]*"+b+")?) *([^ :"+b+"(]) *(:?.*)$")
		const circleRegex = new RegExp("& ([A-Z]+) ([0-9]+) circle")

		function removeComments(lines) {
			/*
			return lines.map(str => {
				const index = str.indexOf("'");
				return index !== -1 ? str.slice(0, index) : str;
			}); // remove comments '
			*/
			let result = [];
			for (let i = 0; i !== lines.length; i++) {  // moodle replaces <
				const str = lines[i];
				const index = str.indexOf("'");
				result.push(index !== -1 ? str.slice(0, index) : str);
			}
			return result; // remove comments '

		}
		
		function heading(participants,line,participants_y,participants_width,font_size_title) {
			line = line.split('participant ')[1];
			text=line
			if (line.startsWith('"')) {
				text = line.split('"')[1];
				line = line.split('" as ')[1];
			}
			participants.push(line);
			return lessThan+'text style="white-space: pre; fill: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: ' + font_size_title + 'px;" x="' + (participants.length * participants_width - text.length * (font_size_title - 6) / 2) + '" y="' + participants_y + '"'+greaterThan + text +lessThan+'/text'+greaterThan;
		}

		// line ≈120
		//    if (x1==x2) {
		//	    out += lessThan+'path id="arrow'+lin_nbr+'" style="fill: none; stroke: '+colour+';" stroke-dasharray="'+dash+'" d="M '+x1+' '+y1+' Q '+(x1+(y2-y1))+' '+((y1+y2)/2)+' '+x1+' '+y2+'" marker-end="url(#arrow_'+colour+')" /'+greaterThan;
		//	    out += lessThan+'path id="arrow'+lin_nbr+'_mid" style="fill: none; stroke: '+colour+';" stroke-dasharray="'+dash+'" d="M '+x1+' '+y1+' Q '+(x1+(y2-y1))+' '+((y1+y2)/2)+' '+x1+' '+y2+'" marker-end="url(#arrow_'+colour+')" /'+greaterThan;
		// line ≈130
		//    if (x1!=x2) {
		//	    out += lessThan+'path id="arrow'+lin_nbr+'" fill="none" stroke="none" d="M'+x1+','+(y1 - 1)+' L'+x2+','+(y2 - 1)+'" /'+greaterThan;
		//	    out += lessThan+'path id="arrow'+lin_nbr+'_mid" style="fill: none; stroke: none;" stroke-dasharray="0" d="M '+(x1+(x2-x1)/5)+' '+(y1+(y2-y1)/5)+' L '+x2+' '+y2+'" /'+greaterThan;

		var pathIdGlobal=0;
		function pathEl(x1,y1,x2,y2,lineVsText,pos) {
			pathIdGlobal++
			let out=lessThan+'path id="'+HREFID+globalInputBoxId+pathIdGlobal+'" d="'
			
			if (pos=="mid") {
				out+=arrowPathMid(x1,y1,x2,y2,lineVsText)
			} else if (pos=="end") {
				out+=arrowPathEnd(x1,y1,x2,y2,lineVsText)
			} else {
				out+=arrowPath(x1,y1,x2,y2,lineVsText)
			}
			out+='"/'+greaterThan
			//console.log("pthel"+out)
			return pathIdGlobal+":"+out
			//return { out, pathIdGlobal } doesn't work in edge
		}
		function arrowPath(x1,y1,x2,y2,lineVsText) {
			if (x1==x2) {
				return 'M'+x1+' '+y1+' Q'+(x1+(y2-y1))+' '+((y1+y2)/2)+' '+x1+' '+y2
			} else {
				if (lineVsText==TEXTPATH) {
					//if (x2 < x1) {
					if (isLessThan(x2, x1)) {
						[x1, x2] = [x2, x1];
						[y1, y2] = [y2, y1];
					}					
				}
				return 'M'+x1+' '+(y1 - 1)+' L'+x2+' '+(y2 - 1)
			}
		}
		function arrowPathMid(x1,y1,x2,y2,lineVsText) {
			if (x1==x2) {
				return 'M'+x1+' '+y1+' Q'+(x1+(y2-y1))+' '+((y1+y2)/2)+' '+x1+' '+y2
			} else {
				if (lineVsText==TEXTPATH) {
					//if (x2 < x1) {
					if (isLessThan(x2, x1)) {
						[x1, x2] = [x2, x1];
						[y1, y2] = [y2, y1];
					}					
				}
				return 'M'+(x1+(x2-x1)/5)+' '+(y1+(y2-y1)/5)+' L'+x2+' '+y2
			}
		}
		function arrowPathEnd(x1,y1,x2,y2) { // 2/3rds along the diagonal // line ≈100:out += lessThan+'path id="arrow' + lin_nbr + '_end" style="fill: none; stroke: none;" stroke-dasharray="0" d="M ' + (x1 + (x2 - x1) * 2 / 3) + ' ' + (y1 + (y2 - y1) * 2 / 3) + ' L ' + x2 + ' ' + y2 + '" /'+greaterThan;
			return 'M' + (x1 + (x2 - x1) * 2 / 3) + ' ' + (y1 + (y2 - y1) * 2 / 3) + ' L' + x2 + ' ' + y2
		}





		function addText(text,colour,lin_nbr,x1,x2,y1,y2,font_size) {
					out=""
					texts = text.split(";")
					posReg=new RegExp("([a-z_]+)=([^;]+)$")
					for (const text of texts) {
					    match=text.match(posReg)
					  
					  //for (const pos of ["left","start","mid","end","right","midhor","leftend_"]) {
						//reg=new RegExp(pos+"=([^;]+)$")
						//match=text.match(reg)
						if (match!=undefined) {
							pos=match[1]
							txt=match[2]

							if (pos == "left") {
								out += lessThan+'text text-anchor="end" style="white-space: pre; fill: ' + colour + '; font-family: Arial, sans-serif; font-size: ' + font_size + 'px;" x="' + x1 + '" y="' + y1 + '"'+greaterThan + txt + lessThan+'/text'+greaterThan;
							}
							if (pos == "start") {
								let result=pathEl(x1,y1,x2,y2,TEXTPATH,pos).split(":") // 3:<path.../>
								let href=result[0]
								out += result[1]

								//out += lessThan+'text style="white-space: pre; fill: ' + colour + '; font-family: Arial, sans-serif; font-size: ' + font_size + 'px;"'+greaterThan+lessThan+'textPath href="#arrow' + lin_nbr + '"'+greaterThan + txt + lessThan+'/textPath'+greaterThan+lessThan+'/text'+greaterThan;
								//out += lessThan+'text style="white-space: pre; fill: ' + colour + '; font-family: Arial, sans-serif; font-size: ' + font_size + 'px;"'+greaterThan+lessThan+'textPath path="'+arrowPath(x1,y1,x2,y2,TEXTPATH)+'"'+greaterThan + txt + lessThan+'/textPath'+greaterThan+lessThan+'/text'+greaterThan;
								out += lessThan+'text style="white-space: pre; fill: ' + colour + '; font-family: Arial, sans-serif; font-size: ' + font_size + 'px;"'+greaterThan+lessThan+'textPath href="#'+HREFID+globalInputBoxId+href+'"'+greaterThan + txt + lessThan+'/textPath'+greaterThan+lessThan+'/text'+greaterThan;
							}
							if (pos == "starthor") {
								out += lessThan+'text text-anchor="start" style="white-space: pre; fill: ' + colour + '; font-family: Arial, sans-serif; font-size: ' + font_size + 'px;" x="' + x1 + '" y="' + y1 + '"'+greaterThan + txt + lessThan+'/text'+greaterThan;
							}
							if (pos == "midhor") {
								out += lessThan+'text text-anchor="start" style="white-space: pre; fill: ' + colour + '; font-family: Arial, sans-serif; font-size: ' + font_size + 'px;" x="' + (x1 + (y2 - y1) / 2) + '" y="' + ((y1 + y2) / 2) + '"'+greaterThan + txt + lessThan+'/text'+greaterThan;
							}
							if (pos == "mid") {
								let result=pathEl(x1,y1,x2,y2,TEXTPATH,pos).split(":") // 3:<path.../>
								let href=result[0]
								out += result[1]
								// A ->(40) B : start=t=1; mid=1,buy 10;end=end;right=t=max(1,1)=1;left=left
								out += lessThan+'text text-anchor="start" style="white-space: pre; fill: ' + colour + '; font-family: Arial, sans-serif; font-size: ' + font_size + 'px;"'+greaterThan
								//out += lessThan+'textPath href="#arrow' + lin_nbr + '_mid"'+greaterThan + txt + lessThan+'/textPath'+greaterThan+lessThan+'/text'+greaterThan;
								//console.log("text mid"+arrowPath(x1,y1,x2,y2,TEXTPATH))
								//out += lessThan+'textPath path="'+arrowPath(x1,y1,x2,y2,TEXTPATH)+'"'+greaterThan + txt + lessThan+'/textPath'+greaterThan+lessThan+'/text'+greaterThan;
								out += lessThan+'textPath href="#'+HREFID+globalInputBoxId+href+'"'+greaterThan + txt + lessThan+'/textPath'+greaterThan+lessThan+'/text'+greaterThan;
								
							}
							if (pos == "end") {
								let result=pathEl(x1,y1,x2,y2,TEXTPATH,pos).split(":") // 3:<path.../>
								let href=result[0]
								out += result[1]

								//out += lessThan+'path id="arrow' + lin_nbr + '_end" style="fill: none; stroke: none;" stroke-dasharray="0" d="M ' + (x1 + (x2 - x1) * 2 / 3) + ' ' + (y1 + (y2 - y1) * 2 / 3) + ' L ' + x2 + ' ' + y2 + '" /'+greaterThan;
								//out += lessThan+'path id="arrow' + lin_nbr + '_end" style="fill: none; stroke: none;" stroke-dasharray="0" d="'+arrowPathEnd(x1,y1,x2,y2)+'" /'+greaterThan;
								//out += lessThan+'text text-anchor="start" style="white-space: pre; fill: ' + colour + '; font-family: Arial, sans-serif; font-size: ' + font_size + 'px;"'+greaterThan+lessThan+'textPath href="#arrow' + lin_nbr + '_end"'+greaterThan + txt + lessThan+'/textPath'+greaterThan+lessThan+'/text'+greaterThan;
								out += lessThan+'text text-anchor="start" style="white-space: pre; fill: ' + colour + '; font-family: Arial, sans-serif; font-size: ' + font_size + 'px;"'+greaterThan
								//out += lessThan+'textPath path="'+arrowPathEnd(x1,y1,x2,y2,TEXTPATH)+'"'+greaterThan + txt + lessThan+'/textPath'+greaterThan+lessThan+'/text'+greaterThan;
								out += lessThan+'textPath href="#'+HREFID+globalInputBoxId+href+'"'+greaterThan + txt + lessThan+'/textPath'+greaterThan+lessThan+'/text'+greaterThan;
							}
							if (pos == "right") {
								out += lessThan+'text style="white-space: pre; fill: ' + colour + '; font-family: Arial, sans-serif; font-size: ' + font_size + 'px;" x="' + x2 + '" y="' + y2 + '"'+greaterThan + txt + lessThan+'/text'+greaterThan;
							}
							if (pos == "leftend_") {
								out += lessThan+'text text-anchor="end" style="white-space: pre; fill: ' + colour + '; font-family: Arial, sans-serif; font-size: ' + font_size + 'px;" x="' + x2 + '" y="' + y2 + '"'+greaterThan + txt + lessThan+'/text'+greaterThan;
							}
					  }
					}
					return out
				}	
	
	
	function addArrows(colour,lin_nbr,x1,x2,y1,y2,dash) {
			out=""

		    if (x1==x2) {
			    //out += lessThan+'path id="arrow'+lin_nbr+'" style="fill: none; stroke: '+colour+';" stroke-dasharray="'+dash+'" d="M '+x1+' '+y1+' Q '+(x1+(y2-y1))+' '+((y1+y2)/2)+' '+x1+' '+y2+'" marker-end="url(#arrow_'+colour+')" /'+greaterThan;
				out += lessThan+'path style="fill: none; stroke: '+colour+';" stroke-dasharray="'+dash+'" d="'+arrowPath(x1,y1,x2,y2,LINEPATH)+'" marker-end="url(#arrow_'+colour+')" /'+greaterThan;
			    //out += lessThan+'path id="arrow'+lin_nbr+'_mid" style="fill: none; stroke: '+colour+';" stroke-dasharray="'+dash+'" d="M '+x1+' '+y1+' Q '+(x1+(y2-y1))+' '+((y1+y2)/2)+' '+x1+' '+y2+'" marker-end="url(#arrow_'+colour+')" /'+greaterThan;
				out += lessThan+'path style="fill: none; stroke: '+colour+';" stroke-dasharray="'+dash+'" d="'+arrowPathMid(x1,y1,x2,y2,LINEPATH)+'" marker-end="url(#arrow_'+colour+')" /'+greaterThan;
		    } else {
			    out += lessThan+'line style="fill: rgb(0, 0, 0); stroke: '+colour+';" stroke-dasharray="'+dash+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" marker-end="url(#arrow_'+colour+')" /'+greaterThan;
		    }
			/*
			if (x2 < x1) {
				[x1, x2] = [x2, x1];
				[y1, y2] = [y2, y1];
			}
		    if (x1!=x2) {
			    out += lessThan+'path id="arrow'+lin_nbr+'" fill="none" stroke="none" d="M'+x1+','+(y1 - 1)+' L'+x2+','+(y2 - 1)+'" /'+greaterThan;
			    out += lessThan+'path id="arrow'+lin_nbr+'_mid" style="fill: none; stroke: none;" stroke-dasharray="0" d="M '+(x1+(x2-x1)/5)+' '+(y1+(y2-y1)/5)+' L '+x2+' '+y2+'" /'+greaterThan;
			}
			*/
			return out
}

function removeEmpty(lines) {
	let result = [];
	for (let i = 0; i !== lines.length; i++) { // moodle replaces <
		if (lines[i].trim() !== '') {
			result.push(lines[i]);
		}
	}
	lines = result; // remove empty lines
	return lines
}	


function participantLines(participants,participants_y,participants_width,final_y) {
	out=""
	let p = 1;
	/*participants.forEach(participant => {
		out += lessThan+'line style="fill: rgb(0, 0, 0); stroke: rgb(0, 0, 0);" stroke-dasharray="2" x1="' + (p * participants_width) + '" y1="' + (participants_y * 1 + 10) + '" x2="' + (p * participants_width) + '" y2="' + final_y + '" /'+greaterThan;
	    p += 1;
	});*/
	for (let i = 0; i !== participants.length; i++) {
		out += lessThan+'line style="fill: rgb(0, 0, 0); stroke: rgb(0, 0, 0);" stroke-dasharray="2" x1="' + (p * participants_width) + '" y1="' + (participants_y * 1 + 10) + '" x2="' + (p * participants_width) + '" y2="' + final_y + '" /'+greaterThan;
		p += 1;
	}

	return out
}

		var globalInputBoxId="dummy" // used to differentiate textpath ids
        function generateSVG(inputBoxId) {
			globalInputBoxId=inputBoxId
            let inputText = document.getElementById(inputBoxId).value;
			let lines = inputText.split('\n');
			
			lines = removeComments(lines)
			
			//lines=lines.filter(line => line.trim() !== '') // remove empty lines
			lines=removeEmpty(lines)
			
			let participants_width = 55;
            let participants_x = 10; //participants_width*1.5;
            let participants_y = 12;
            let participants = [];
            let y = 20;
            let node_sep = 8;
            let final_y = y;
            let lin_nbr = 0;
			let font_size_title = 14;
			let font_size = 10;

			svgStyle=' style="max-width: 800px;" '
			out=lessThan+'svg'+svgStyle+' xmlns="http://www.w3.org/2000/svg" viewBox="'+participants_x+' 0 400 300"'+greaterThan
			//lines.forEach(line => {
			for (let i = 0; i !== lines.length; i++) {
				line=lines[i]

				//lin_nbr += 1;
				if (line.startsWith('participants_width ')) {
					participants_width = line.split('participants_width ')[1];
					participants_x = participants_width*1.5;
					out = lessThan+'svg'+svgStyle+' xmlns="http://www.w3.org/2000/svg" viewBox="'+participants_x+' 0 400 300"'+greaterThan
				} else if (line.startsWith('font_size_title ')) {
					font_size_title = line.split('font_size_title ')[1];
					console.log('font_size_title '+font_size_title)
				} else if (line.startsWith('participants_x ')) {
					participants_x = line.split('participants_x ')[1];
					out = lessThan+'svg'+svgStyle+' xmlns="http://www.w3.org/2000/svg" viewBox="'+participants_x+' 0 400 300"'+greaterThan
				}
			} //)
			out= out+prefix
			
	let then_y = 0 // same block increament to allow request reply
	//lines.forEach(line => {
	for (let i = 0; i !== lines.length; i++) {
		line=lines[i]
		lin_nbr += 1;
		if (line.startsWith('participants_width ') || line.startsWith('participants_x ')|| line.startsWith('font_size_title ')) {
			
		} else if (line.startsWith('font_size ')) {
					font_size = line.split('font_size ')[1];
					console.log('font_size '+font_size)
		} else if (line.startsWith('participant ')) {
			// modified participants
			out += heading(participants,line,participants_y,participants_width,font_size_title)
		} else { // not participants
			if (!(line.includes("& return"))) {
				then_y = 0
			} else {
				line=line.replace("& return","&") // finished?
			}
			// & A (40)-[#blue]-> B : text
			
			
			linematch = line.match(regex)
			if (linematch!=null) {
				ampersand=(linematch[1]=="&")
				srcname=linematch[2]
				drop=linematch[3]
				linematch_colour=linematch[4]
				dashed=(linematch[5]=="-")
				dropdst=linematch[6]
				dst=linematch[7]
				txt=linematch[8]
				if (true) {
					console.log(ampersand)
					console.log(srcname)
					console.log("-drop:"+drop)
					console.log("colour:"+linematch_colour)
					console.log("dashed:"+dashed)
					console.log("dropdst:"+dropdst)
					console.log("dst:"+dst)
					console.log("txt:"+txt)
				}
			
				

				let same_block = ampersand;

				colour="black"
				if (linematch_colour!="") {
					colour=linematch_colour.substring(2,linematch_colour.length-1) // [#blue]
					console.log("Colour:"+colour)
					
				}

				dash="0"
				if (dashed) {
					dash="1"
				}
				
				let src_dst // = line.split('-'+greaterThan); // legacy
				let src_yinc // = src_dst[0].split(' '); // A,(10) // legacy
				let src // = src_yinc[0]; // A // legacy
				src = srcname
				let src_x_ind = participants.indexOf(src) + 1;
				let src_x = src_x_ind * participants_width;


				src_yinc // = src_yinc[1];  // (10) or none  //legacy
				src_yinc = drop // (10)-
				src_has_yinc = src_yinc.split('(');
				if (src_has_yinc.length >= 1+1) {
					src_has_yinc = src_has_yinc[1].split(')')
					src_has_yinc = src_has_yinc[0]
				} else {
					src_has_yinc="0"
				}


				let dst_x=0
				//console.log("122 src_dst[1]")
				//console.log(src_dst[1]) // (40) C: ....
				let dst_yinc // = src_dst[1].split(' ');  // legacy
				dst_yinc = [ dropdst, dst ]  // # [ (40),  C]
				if (dst_yinc!=undefined) {
					let dst = dst_yinc[1];
					let dst_x_ind = participants.indexOf(dst) + 1;
					dst_x = dst_x_ind * participants_width;

					dst_yinc = dst_yinc[0];
					let dst_has_yinc = dst_yinc.split('(');
					//if (dst_has_yinc.length > 1) { // moodle replace >
					if (dst_has_yinc.length !== 0 && dst_has_yinc.length !== 1) {
						dst_has_yinc = dst_has_yinc[1].split(')')[0];
						dst_yinc = dst_has_yinc;
						if (dst_yinc=='') { dst_yinc='0' }
						} else {
							dst_yinc = "0";
						}
					} else {
						dst_yinc = "0";
					}

				y=y+then_y // tmp req/reply
				if (same_block) {
					//console.log(src_has_yinc)
					y += parseInt(src_has_yinc); // tmp
				} else {
					y = final_y + node_sep;
				}

				

				final_y = Math.max(final_y,y + parseInt(dst_yinc));



				let x1 = src_x;
				let y1 = y;
				let x2 = dst_x;
				let y2 = y + parseInt(dst_yinc);

				out+=addArrows(colour,lin_nbr,x1,x2,y1,y2,dash)
				
				if (line.includes(":")) { // something to print
					text = line.split(":")
					text=text[1]
					if (!(text.includes(";")) && !(text.includes("="))) {
						if (src==dst) {
							text="midhor="+text+";"
						} else {
							text="mid="+text+";"
						}
						// out+=<text text-anchor="middle" style="white-space: pre; fill: ${colour}; font-family: Arial, sans-serif; font-size: ${font_size}px;"><textPath href="#arrow${lin_nbr}">${text}</textPath></text>
					}
					out+=addText(text,colour,lin_nbr,x1,x2,y1,y2,font_size)
					
						
				} // something to print
				y=y-then_y
				if (same_block) {
					y -= parseInt(src_has_yinc);
				}
				console.log(then_y)
				then_y += parseInt(src_has_yinc) + parseInt(dst_yinc)+node_sep;
			} // line match
			circlematch = line.match(circleRegex)
			if (circlematch!=null) {
				// & C 40 circle
				srcname=circlematch[1] // C 
				drop=circlematch[2]
				console.log("circle "+srcname+drop)
				let src_x_ind = participants.indexOf(srcname) + 1;
				let cx = src_x_ind * participants_width;
				let cy=y+parseInt(drop)
				out+=lessThan+"circle cy='"+cy+"' r='10' cx='"+cx+"'  fill='lightgrey' opacity='0.5' /"+greaterThan
			}				
			spacereg = new RegExp("space ([-0-9]+)")
			spacematch = line.match(spacereg)
			if (spacematch!=null) {
				final_y = final_y + parseInt(spacematch[1]);
			}
			
		  } // handle all lines except partipants
        } //);
		final_y=final_y+10
		out += participantLines(participants,participants_y,participants_width,final_y)
		out += lessThan+'/svg'+greaterThan;
		console.log(out)
		document.getElementById('output_'+inputBoxId).innerHTML = out;
		document.getElementById('outer_'+inputBoxId).style.maxHeight = (2*final_y)+"px";
		
	}

