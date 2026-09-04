// Lunicode.js
// from lunicode.com
// on GitHub: https://github.com/combatwombat/Lunicode.js
// Copyright © 2012 Robert Gerlach - robsite.net
function Lunicode() {
  this.tools = {
  
    // Flip/rotate Text by 180°
    
    flip: {
      init: function() {
                
        // invert the map
        for (i in this.map) {
          this.map[this.map[i]] = i;
        }
        
      },
      
      encode: function(text) {
        var ret = [],
            ch;
        
        for (var i = 0, len = text.length; i < len; i++) {
          ch = text.charAt(i);
          
          // combining diacritical marks: combine with previous character for ä,ö,ü,...
          if (i > 0 && (ch == '\u0324' ||
                        ch == '\u0317' ||
                        ch == '\u0316' ||
                        ch == '\u032e')) {
            ch = this.map[text.charAt(i-1) + ch];
            ret.pop();             
                          
          } else {
            ch = this.map[ch];
            if (typeof(ch) == "undefined") {
              ch = text.charAt(i);
            }
          }
          
          ret.push(ch); 
          


        }    

        return ret.reverse().join("");
      },
      
      decode: function(text) {
        var ret = [],
            ch;
        
        for (var i = 0, len = text.length; i < len; i++) {
          ch = text.charAt(i);
          
          if (i > 0 && (ch == '\u0324' ||
                        ch == '\u0317' ||
                        ch == '\u0316' ||
                        ch == '\u032e')) {
            ch = this.map[text.charAt(i-1) + ch];
            ret.pop();
            
          } else {
            ch = this.map[ch];
            if (typeof(ch) == "undefined") {
              ch = text.charAt(i);
            }
          }          

          ret.push(ch);          
        }
        return ret.reverse().join("");
      },
      
      map: {
          'a' : '\u0250',
          'b' : 'q',      
          'c' : '\u0254', 
          'd' : 'p',      
          'e' : '\u01DD', 
          'f' : '\u025F', 
          'g' : '\u0253', 
          'h' : '\u0265', 
          'i' : '\u0131', 
          'j' : '\u027E', 
          'k' : '\u029E',
          'l' : '\u006C',
          'm' : '\u026F',
          'n' : 'u',
          'r' : '\u0279',
          't' : '\u0287',
          'v' : '\u028C',
          'w' : '\u028D',
          'y' : '\u028E',
          'A' : '\u2200',
          'B' : 'ᙠ',
          'C' : '\u0186',
          'D' : 'ᗡ',
          'E' : '\u018e',
          'F' : '\u2132',
          'G' : '\u2141',
          'J' : '\u017f',
          'K' : '\u22CA',
          'L' : '\u02e5',
          'M' : 'W',
          'P' : '\u0500',
          'Q' : '\u038C',
          'R' : '\u1D1A',
          'T' : '\u22a5',
          'U' : '\u2229',
          'V' : '\u039B',
          'Y' : '\u2144',
          '1' : '\u21c2',
          '2' : '\u1105',
          '3' : '\u0190',
          '4' : '\u3123',
          '5' : '\u078e',
          '6' : '9',
          '7' : '\u3125',
          '&' : '\u214b',
          '.' : '\u02D9',
          '"' : '\u201e',
          ';' : '\u061b',
          '[' : ']',
          '(' : ')',
          '{' : '}',
          '?' : '\u00BF', 
          '!' : '\u00A1',
          "'" : ',',
          '<' : '>'
      }
    },
    
    // Mirror text (flip horizontally)
    mirror: {
      init: function() {
                
        // invert the map
        for (i in this.map) {
          this.map[this.map[i]] = i;
        }
        
      },
      
      encode: function(text) {
        var ret = [],
            ch,
            newLines = [];
        
        for (var i = 0, len = text.length; i < len; i++) {
          ch = text.charAt(i);
          
          if (i > 0 && (ch == '\u0308' ||
                        ch == '\u0300' ||
                        ch == '\u0301' ||
                        ch == '\u0302')) {
            ch = this.map[text.charAt(i-1) + ch];
            ret.pop();
          } else {
            ch = this.map[ch];
            if (typeof(ch) == "undefined") {
              ch = text.charAt(i);
            }
          }
          
          
          if (ch == '\n') {
            newLines.push(ret.reverse().join(""));
            ret = [];
          } else {
            ret.push(ch);
          }
          
   
        }    
        newLines.push(ret.reverse().join(""));
        return newLines.join("\n");
      },
      
      decode: function(text) {
        var ret = [],
            ch,
            newLines = [];
        
        for (var i = 0, len = text.length; i < len; i++) {
          ch = text.charAt(i);
          
          if (i > 0 && (ch == '\u0308' ||
                        ch == '\u0300' ||
                        ch == '\u0301' ||
                        ch == '\u0302')) {
            ch = this.map[text.charAt(i-1) + ch];
            ret.pop();
          } else {
            ch = this.map[ch];
            if (typeof(ch) == "undefined") {
              ch = text.charAt(i);
            }
          }          
          
          if (ch == '\n') {
            newLines.push(ret.reverse().join(""));
            ret = [];
          } else {
            ret.push(ch);
          }
        }
        
        newLines.push(ret.reverse().join(""));
        return newLines.join("\n");
      },
      
      map: {         
          'a' : 'ɒ',
          'b' : 'd',      
          'c' : 'ɔ',       
          'e' : 'ɘ', 
          'f' : 'Ꮈ', 
          'g' : 'ǫ', 
          'h' : 'ʜ',  
          'j' : 'ꞁ', 
          'k' : 'ʞ',
          'l' : '|',
          'n' : 'ᴎ',
          'p' : 'q',
          'r' : 'ɿ',
          's' : 'ꙅ',
          't' : 'ƚ',
          'y' : 'ʏ',
          'z' : 'ƹ',
          'B' : 'ᙠ',
          'C' : 'Ɔ',
          'D' : 'ᗡ',
          'E' : 'Ǝ',
          'F' : 'ꟻ',
          'G' : 'Ꭾ',
          'J' : 'Ⴑ',
          'K' : '⋊',
          'L' : '⅃',
          'N' : 'Ͷ',
          'P' : 'ꟼ',
          'Q' : 'Ọ',
          'R' : 'Я',
          'S' : 'Ꙅ',
          'Z' : 'Ƹ',
          '[' : ']',
          '(' : ')',
          '{' : '}',
          '?' : '⸮', 
          '<' : '>'
      }
    },
    
    creepify: {
      init: function() {
        for (var i = 768; i <= 789; i++) {
          this.diacriticsTop.push(String.fromCharCode(i));
        }
        
        for (var i = 790; i <= 819; i++) {
          if (i != 794 && i != 795) {
            this.diacriticsBottom.push(String.fromCharCode(i));
          }
        }
        this.diacriticsTop.push(String.fromCharCode(794));
        this.diacriticsTop.push(String.fromCharCode(795));
        
        for (var i = 820; i <= 824; i++) {
          this.diacriticsMiddle.push(String.fromCharCode(i));
        }
      },
      
      encode: function(text) {
        var newText = '',
            newChar;
        for (i in text) {
          newChar = text[i];
          
          if (this.options.middle) {
              newChar += this.diacriticsMiddle[Math.floor(Math.random()*this.diacriticsMiddle.length)]          
          }
          
          if (this.options.top) {
            var diacriticsTopLength = this.diacriticsTop.length - 1;
            for (var count = 0, len = this.options.maxHeight - Math.random()*((this.options.randomization/100)*this.options.maxHeight); count < len; count++) {
              newChar += this.diacriticsTop[Math.floor(Math.random()*diacriticsTopLength)]          
            }
          }      
          
          if (this.options.bottom) {
            var diacriticsBottomLength = this.diacriticsBottom.length - 1;
            for (var count = 0, len = this.options.maxHeight - Math.random()*((this.options.randomization/100)*this.options.maxHeight); count < len; count++) {
              newChar += this.diacriticsBottom[Math.floor(Math.random()*diacriticsBottomLength)]          
            }
          }
          
          newText += newChar;
        }
        return newText;
      },
      
      decode: function(text) {
        var newText = '',
            charCode;
            
        for (i in text) {
          charCode = text[i].charCodeAt(0);
          if (charCode < 768 || charCode > 865) {
            newText += text[i];
          }
        }
        return newText;
      },
      
      diacriticsTop: [],
      diacriticsMiddle: [],
      diacriticsBottom: [],
      
      options: {
        top: true,
        middle: true,
        bottom : true,
        maxHeight: 15,
        randomization: 100
      }
    },
    
    tiny: {
      init: function() {
        for (i in this.map) {
          this.map[this.map[i]] = i;
        }
      },

      encode: function(text) {
        var ret = '',
            ch;
        text = text.toUpperCase();
        for (var i = 0, len = text.length; i < len; i++) {
          ch = this.map[text.charAt(i)];
          if (typeof(ch) == "undefined") {
            ch = text.charAt(i);
          }
          ret +=  ch;
        }    
        return ret;
      },

      decode: function(text) {
        var ret = '',
            ch;

        for (var i = 0, len = text.length; i < len; i++) {
          ch = this.map[text.charAt(i)];
          if (typeof(ch) == "undefined") {
              ch = text.charAt(i);
          }
          ret += ch;          
        }
        return ret;
      },

      map: {        
          'A' : 'ᴀ',
          'B' : 'ʙ',
          'C' : 'ᴄ',
          'D' : 'ᴅ',
          'E' : 'ᴇ',
          'F' : 'ꜰ',
          'G' : 'ɢ',
          'H' : 'ʜ',
          'I' : 'ɪ',
          'J' : 'ᴊ',
          'K' : 'ᴋ',
          'L' : 'ʟ',
          'M' : 'ᴍ',
          'N' : 'ɴ',
          'O' : 'ᴏ',
          'P' : 'ᴘ',
          'Q' : 'Q',
          'R' : 'ʀ',
          'S' : 'ꜱ',
          'T' : 'ᴛ',
          'U' : 'ᴜ',
          'V' : 'ᴠ',
          'W' : 'ᴡ',
          'X' : 'x',
          'Y' : 'ʏ',
          'Z' : 'ᴢ'
      }
    }
  };
  
  for (i in this.tools) {
    this.tools[i].init();
  }
}
