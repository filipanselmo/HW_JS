class Good {
    constructor(id, name, description, sizes, price) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = false;
    }

    setAvailable(value) {
        this.available = value;
    }    
}


class BasketGood extends Good {
    constructor(id, name, description, sizes, price, amount) {
        super(id, name, description, sizes, price)
        this.amount = amount;
    }
}


class GoodsList {
    constructor(filter, sortPrice, sortDir) {
        this._goods = []
        this.filter = filter === undefined ? /./i: filter;
        this.sortDir = sortDir === undefined ? false: sortDir;
        this.sortPrice = sortPrice === undefined ? false: sortPrice;
    }

    _find_index(id) {
        let index = this._goods.map((e, i) => [i, e]).filter(el => el[1].id === id)[0];
        if(index === undefined) {
            return -1;
        }
        return index[0];
    }

    _removeIndexOf(index) {
        this._goods.splice(index, 1);
    }

    get list() {

        let result = this._goods.filter(el => this.filter.test(el.name));
        if(!this.sortPrice) {
            return result;
        }

        if(this.sortDir) {
            return result.sort((el_1, el_2) => el_1.price - el_2.price);
        }
        return result.sort((el_1, el_2) => el_2.price - el_1.price);
    }

    add(good) {
        this._goods.push(good);
    }

    remove(id) {
        let index = this._find_index(id);;
        if( index === -1) {
            return
        }

        this._removeIndexOf(index);
    }
}

class Basket extends GoodsList {
    constructor(...args) {
        super(...args)
    }

    get totalAmount() {
        return this._goods.reduce((accum, curr) => accum + curr.amount, 0);
    }

    get totalSum() {
        return this._goods.reduce((accum, curr) => accum + curr.amount * curr.price, 0);
    }

    add(good, amount) {
        let index = this._find_index(good.id);
        if(index === -1) {
            good.amount += amount;
            super.add(good);
            return;
        }

        this._goods[index].amount += amount;
    }

    remove(good, amount) {
        let index = this._find_index(good.id);
        if(index === -1) {
            return;
        }

        this._goods[index].amount -= amount;

        if(this._goods[index].amount <= 0) {
            super._removeIndexOf(index);
        }
    }

    clear() {
        this._goods = [];
    }

    removeUnavailable() {
        this._goods = this._goods.filter(el => el.available)
    }
}


function main() {
    let goods = [
        new Good(33, "<Ботинки>", "text", [35,36], 3000),
        new Good(35, "Шляпа", "text", [35,36], 2000),
        new Good(66, "Платье", "text", [35,36], 5000),
        new Good(123, "Юбка", "text", [35,36], 3500),
        new Good(1, "Шарф", "text", [35,36], 1000),
    ]

    let goodsList = new GoodsList();

    goodsList.add(goods[1]);
    goodsList.add(goods[3]);
    goodsList.add(goods[2]);

    console.log(goodsList.list);
    goodsList.filter = /a/i;
    console.log("filtered ", goodsList.list);

    goodsList.remove(33);
    console.log(goodsList.list);

    goodsList.filter = /./i;
    console.log("sorted\n")
    goodsList.sortPrice = true;
    goodsList.sortDir = true;
    console.log(goodsList.list);


    let basket = new Basket();
    let basketGoods = [
        new BasketGood(33, "<Ботинки>", "text", [35,36], 3000, 20),
        new BasketGood(35, "Шляпа", "text", [35,36], 2000, 0),
        new BasketGood(66, "Платье", "text", [35,36], 5000, 6),
        new BasketGood(123, "Юбка", "text", [35,36], 3500, 1),
        new BasketGood(1, "Шарф", "text", [35,36], 1000, 0),
    ]

    basket.add(basketGoods[0], 5);
    console.log(basket.list);

    basket.remove(basketGoods[0], 15)
    console.log(basket.list);

    basket.remove(basketGoods[0], 100)
    console.log(basket.list);

    basket.add(basketGoods[1], 5);
    console.log(basket.list);
    console.log(basket.totalAmount, basket.totalSum);

    basket.removeUnavailable();
    console.log(basket.list);

    basket.add(basketGoods[1], 5);
    basket.clear()
    console.log(basket.list);
}

main();