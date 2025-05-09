import { Heart, ShoppingCart } from "lucide-react"

const Navbar = () => {
  return (
    <div className='flex justify-between items-center py-4 px-4 shadow-md' >
        <div className="w-26" ><img className="w-full" src={'/assets/logo.webp'} /> </div>


        <div className="flex gap-4  " >
          <div className="relative" >
        <Heart className="text-primary" />
          </div>
          <div className="relative" >
        <ShoppingCart className="text-primary" />
          </div>
        </div>
      </div>
  )
}

export default Navbar