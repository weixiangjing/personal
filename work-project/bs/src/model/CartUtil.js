class CartUtil {
     CART_STORAGE_KEY="service_market_cart";
     CART_PRODUCT_KEY="product_code";
     CART_COMBO_KEY  ="combo_code";

    getCartData() {
        try {
            return JSON.parse(localStorage.getItem(this.CART_STORAGE_KEY))||[]
        } catch(e) {
            return [];
        }
    }

    setCartData(data) {
        return localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(data));
    }
    clear(){
        window.__header.setState({num:0});
        this.setCartData([]);
    }
    
    
    hasProduct(){
      
        let data =this.getCartData();
        let one =data[0];
        return (one && one.product_code);
    }
    hasPack(){
        let data =this.getCartData();
        let one =data[0];
        return (one && one.combo_code);
    }

    // 只有服务产品才能添加到购物车
    addToCart(product, uniqueKey=this.CART_PRODUCT_KEY) {
        let data = this.getCartData();
        if(data.length==1 && data[0][this.CART_COMBO_KEY]){// 如果购物车里面有套餐，在添加产品的时候，清空数据
            data=[];
        }
        let item=data.find((item)=>item[uniqueKey]==product[uniqueKey]);
        if(item) {
            item.num+=1;
        } else {
            product.num=1;
            product.id=Math.random().toString().slice(2);
            data.push(product);
        }
        this.setCartData(data);
        return this.getTotal(data);
    }

    subFromCart(product, uniqueKey=this.CART_PRODUCT_KEY) {
        let data=this.getCartData();
        let item;
        if(typeof product!=="number") {
            item=data.find((item)=>item[uniqueKey]==product[uniqueKey]);
        } else {
            item=data[product];
        }
        if(item&&item.num>1) {
            item.num-=1;
        }
        this.setCartData(data);
        return this.getTotal(data);
    }

    removeFromCart(product, uniqueKey=this.CART_PRODUCT_KEY) {
        let data=this.getCartData();
        if(typeof product!=="number") {
            product=data.findIndex((item)=>item[uniqueKey]==product[uniqueKey]);
        }
        data.splice(product, 1);
        this.setCartData(data);
        return this.getTotal(data);
    }

    getTotal(data) {
        data   =data||this.getCartData();
        let num=0;
        for(let i=0; i<data.length; i++) {
            num+=data[i].num;
        }
        return num;
    }
}
export default new CartUtil();