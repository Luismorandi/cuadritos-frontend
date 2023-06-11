

export class LocalStorage{
    constructor(name){
        this.name= name;

    }

    getData(){
        return JSON.parse(localStorage.getItem(`${this.name}`));

    }

    setData(itemsPushed){
        localStorage.setItem(`${this.name}`, JSON.stringify(itemsPushed));
    }
    clearData(){
        localStorage.removeItem(`${this.name}`)
    }

}




class Cart {
    constructor(repository ){
        this.repository = repository

    }
    

    getCart(){
        const data =  this.repository.getData()
        const cart = !data ? [] : data
        return cart

    }

    amountCart(){ 

        const cart = this.getCart();
        const totalCart =  cart.reduce((acumulador, obj) => acumulador + obj.precio, 0 );
        return totalCart
        } ;

    deleteProduct (prodId){
           const cart = this.getCart();
           const newCart = cart.filter(product => product.id !== prodId)
           this.repository.setData(newCart)
           console.log(newCart)
        }

    deleteCart(){
        console.log('hola1')
        this.repository.setData([])
    }

    randomCart(){
      let randomCart = [];
            for(let i = 0; i < 4; i++){
                let precioPrincipal1= (Math.floor(Math.random() * (10000 - 100 + 1)) + 100)
                let cantidad1= (Math.floor(Math.random() * 100) + 1);
                const product = {
                    nombre: `Cuadro ${i}`,
                   precioPrincipal: precioPrincipal1,
                   precio: precioPrincipal1,
                   cantidad:cantidad1,
                   cantidadPrecio :cantidad1,
                   id: i
                }
                randomCart.push(product);
        
            }

            this.repository.setData(randomCart)
            return this.repository.getData()
        
    }
          
            

}