// waterfall.js

function WaterFall(obj) {
	this.id = obj.id;
	this.imgUrls = obj.imgUrls;
	this.container = document.getElementById(this.id);
	this.container.className = 'forcenter';
}

WaterFall.prototype = {
	WFRender: function() {
		let flag = 0; // 标志位，用于检测每一张图片都加载完毕
	
		this.imgUrls.map((item, i) => {
			let div = document.createElement('div');
			div.className = 'item wow';
			let img = new Image();
			img.src = item;
			img.onload = () => {
				flag++;
				div.appendChild(img);
				this.container.appendChild(div);
				// 全部图片加载完毕后再开始布局，否则获取不到元素的最终高度。
				if (flag === this.imgUrls.length) {
					this.resizeWF();
				}
			}
		});
		
		
		


		let styleE = document.createElement('style');
		styleE.innerHTML = `div.item{
        position: absolute;
        transition: all .5s;  /* 使过渡平滑*/
        width : 200px;
        height: auto;
        padding:5px;
        box-sizing: border-box;  /* 非常重要，可将不必要的计算略去 */
// 		opacity:0;
      }
      div.item img{
        width: 100%;
        height: auto;
	
      }
      .forcenter{
        position: relative;
        margin: auto;
      }`;
	this.container.appendChild(styleE);

	},
	resizeWF: function() {
		let winW = window.innerWidth;
		let itemNum = Math.floor(winW / 200); // 当每一个项的宽度都是固定的时候，需要计算出浏览器一行可以排列几个。
		this.container.style.width = (itemNum * 200) + 'px'; // 用于居中的包裹盒子的宽度

		let saveColumnHeight = []; // 定义一个数组，用于存储 每一列所有元素的高度 之和
		let items = document.querySelectorAll('.item');

		for (let i = 0; i < items.length; i++) {
			
			if (saveColumnHeight.length < itemNum) {
				saveColumnHeight[i] = items[i].offsetHeight; // 当布局的元素还没占满一行时，继续向数组中添加第一行第i列的高度
				setDiv(items[i], 200 * i, 0); // 放置div
				
			} else { // 当已经占满一行时，就找出每一列的最小高度，然后当前的这个div放在高度最小的那一列
				let pos = getMinH(saveColumnHeight); //去找高度最小的那一列
				saveColumnHeight[pos.column] += items[i].offsetHeight;
				setDiv(items[i], pos.left, pos.top); // 放置div
				
			}
			
			$(items[i]).addClass(i%2?'fadeInRight':'fadeInLeft').attr('animationName',i%2?'fadeInRight':'fadeInLeft');

		}
		initAnimated();
		$(window).scroll(function(){
			initAnimated();
		})
		
		
	}
}
function initAnimated(){
	const outerHeight = $(window).scrollTop() + window.outerHeight+30;
	$('.wow').each(function(item){
		const _self  = $('.wow').eq(item);
		const top = _self.offset().top;
		if(!_self.hasClass('animated') && top < outerHeight){
			_self.css('animationName',_self.attr('animationName')).addClass('animated');
		}
	})
}


// 工具性函数，不必放入原型链。
function getMinH(arr) {
	let flag = {
		left: 0,
		top: 0,
		column: 0
	}

	arr.map((item, i) => {
		if (flag.top === 0) {
			flag.top = item;
		} else {
			if (flag.top > item) { // 找出高度最小的那一列
				flag.top = item;
				flag.left = 200 * i;
				flag.column = i;
			}
		}
	});

	return flag;
}

function setDiv(item, left, top) {
	item.style.left = left + 'px';
	item.style.top = top + 'px';
	item.style.animationName = 'none';
// 	item.style.opacity = '1';
}
