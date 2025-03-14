import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Recipes_URLS } from "../../services/api/apiConfig";
import { axiosPrivateInstance, imgURL } from "../../services/api/apiInstance";
import { Link } from "react-router-dom";

import Header from "../../Shared/Header/Header";
import receipeImgHeader from '../../assets/images/categoryimg-header.svg'
import Nodata from "../../Shared/Nodata/Nodata";
import DeleteComfirmation from "../../Shared/DeleteComfirmation/DeleteComfirmation";
import Loading from "../../Shared/Loading/Loading";
import noimg from '../../assets/images/no-plate2.jpg';
import { Modal } from "react-bootstrap";
import { BeatLoader } from "react-spinners";


export default function RecipesList() {
  const [recipes,setRecipes]=useState([])
  const [selectedId,setSelectedId]=useState(null)
  const [loading, setLoading] = useState(true);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [isDeleting,setIsDeleting]=useState(false)
  const [recipe,setRecipe]=useState(null)

  const [show, setShow] = useState(false);

  const handleShow = (id) => {
    setSelectedId(id)
    setShow(true)
  }

  const handleClose = () => setShow(false);

  const [showRecipe, setShowRecipe] = useState(false);

  const handleCloseRecipe = () => setShowRecipe(false);
  const handleShowRecipe = (id) => {
    setShowRecipe(true)
    getRecipe(id)
  }

// get all recipe
  const getAllRecipes=async()=>{
    setLoading(true)

  try {
    const {data}= await axiosPrivateInstance.get(Recipes_URLS.GET_RECIPIES(10,1))
    setRecipes(data?.data)
  } catch (error) {
    console.log(error)
  }finally {
    setLoading(false);
  }
  }
// delete recipe
  const deleteRecipy=async()=>{
   setIsDeleting(true)
     try {
      const {data}=await axiosPrivateInstance.delete(Recipes_URLS.DELETE_RECIPE(selectedId))
        console.log(data)
        handleClose()
        getAllRecipes()
        toast.success('Recipe deleted successfully!')
     } catch (error) {
      console.log(error)
      toast.error('Failed to delete recipe. Please try again.')
  
     }finally{
      setIsDeleting(false)
     }
     }
// get single recipe detail
   const getRecipe=async(id)=>{
     setLoadingRecipe(true)
    try {
      const {data}=await axiosPrivateInstance.get(Recipes_URLS.GET_RECIPE(id))
      console.log(data)
      setRecipe(data)
    } catch (error) {
      console.log(error)
    }finally{
      setLoadingRecipe(false)
    }
   }

    useEffect(()=>{
      getAllRecipes()
    },[])

    return <>
  <Header
  title={'Recipes'}
  subtitle={' Items'}
  description={'You can now add your items that any user can order it from the Application and you can edit'}
  img={<img src={receipeImgHeader} alt="receipe img header"  />}
  />

   

 <div className="d-flex details container-fluid  px-md-4 px-2 ">
    <div className={`w-100  d-flex flex-md-row flex-column justify-content-between py-2 py-md-5  px-3 rounded-3 align-items-center `}>
    <div className="caption mb-2 mb-md-0">
      <h4 className="mb-0">Recipe Table Details </h4>
      <p className="mb-0">You can check all details</p>
    </div>


    <Link to={'/dashboard/recipes-data'} className={" btn-add px-3 py-2 text-decoration-none  px-md-5 py-md-3  text-white fw-bold"}>
      Add New Item
  </Link>
    </div>
  
  </div>

<div className="container px-md-4 px-2  receipe-inputs">
  <div className="row">
    <div className="col-md-6">
<div class="input-group mb-3">
  <span class="input-group-text search-icon" id="basic-addon1">  <i className="fa-solid fa-magnifying-glass"></i></span>
  <input type="text" class="form-control border-start-0" placeholder="Search here ..." aria-label="Search" aria-describedby="basic-addon1"/>
</div>
  

    </div>
<div className="col-md-3">
<select class="form-select mb-3" aria-label="Default select example">
  <option selected>Tag</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>
</div>
<div className="col-md-3">
<select class="form-select mb-3" aria-label="Default select example">
  <option selected>Category</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>
</div>
  </div>
</div>






<div className="px-md-4 px-2 text-center  ">
{loading?<Loading/>:  <table className="table table-striped mt-3 ">
  <thead>
    <tr>
   
      <th scope="col">Name</th>
      <th scope="col">Image</th>
      <th scope="col">Price</th>
      <th scope="col">Description</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    {recipes.length>0? recipes.map((recipe,index)=><tr className={`table-row ${index%2==0?'odd-row':'even-row'}`} key={recipe.id}>

      <td className="align-middle">{recipe.name}</td>
      <td className="align-middle">{<img loading="lazy" src={recipe.imagePath?`${imgURL}/${recipe.imagePath}`:noimg} alt={recipe.name} className="recipe-img rounded-2" />}</td>
      <td className="align-middle">{recipe.price} EGP</td>
      <td className="align-middle">{recipe.description}</td>
      <td className="align-middle">
      <div className="dropdown">
  <button className="btn btn-dropdown " type="button" data-bs-toggle="dropdown" aria-expanded="false">
  <i className="fa-solid fa-ellipsis"></i>
  </button>
  <ul className="dropdown-menu">
    <li><button onClick={()=>handleShowRecipe(recipe?.id)} className="dropdown-item" type="button"><i className="fa-solid fa-eye me-3"></i>View</button></li>
    <li><button className="dropdown-item" type="button"><i className="fa-solid fa-pen-to-square me-3"></i>Edit</button></li>
    <li><button onClick={()=>handleShow(recipe.id)} className="dropdown-item" type="button"  > <i className="fa-solid fa-trash me-3"></i>Delete</button></li>
  </ul>
</div>
    
      </td>
    </tr>):<td colSpan="5" className="text-center">
      <Nodata />
    </td>}
  
  </tbody>
</table>}
  </div>
  <DeleteComfirmation deleteFunction={deleteRecipy} show={show} handleClose={handleClose} isDeleting={isDeleting} deleteItem={'Recipe'}  />



{/* show recipe detail */}
  <Modal centered show={showRecipe} onHide={handleCloseRecipe}>

       {loadingRecipe?  <BeatLoader color="rgba(0, 146, 71, 1)" size={20} />:<>
        <Modal.Header closeButton={false}>
          <Modal.Title>{recipe?.name}</Modal.Title>
          <div className="close-modal d-flex justify-content-center align-items-center" onClick={handleCloseRecipe}>
        <i className="fa-solid fa-xmark btn-closemodal" ></i>
        </div>
        </Modal.Header>
        <Modal.Body>
           <img loading="lazy" src={recipe?.imagePath?`${imgURL}/${recipe.imagePath}`:noimg} alt={recipe?.name} className="w-75"  />
      
        <div className="text-start mt-3 modal-detail px-3">
          <h6 ><i class="fa-solid fa-file-lines me-1"></i> Description: <span>{recipe?.description}</span></h6>
         {recipe?.category.length>0? <h6><i class="fa-regular fa-calendar-days me-1"></i>Category: <span>{recipe?.category[0].name}</span></h6>:null}
          <h6> <i class="fa-solid fa-tag me-1"></i>Tag: <span>{recipe?.tag['name']}</span></h6>
          <h6> <i class="fa-solid fa-money-bills me-1"></i>Price: <span>{recipe?.price} EGP</span></h6>
        </div>
        </Modal.Body>
       
       </>}
       <Modal.Footer>
        <button type="button" 
        onClick={handleCloseRecipe} className="btn delete-btn "  >Close</button>
        </Modal.Footer>
      </Modal>
  </>
}
