import { useState } from "react"
import Modal from "./components/Modal"

const App = () =>  {
  const [images, setImages] = useState(null)
  const [value, setValue] = useState(null)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const mysteryOptions = [
    "Tea-drinking octopus solves underwater mysteries daily.",
    "Robot therapist heals hearts with emojis.",
    "Invisible library, only cats can visit.",
    "Parallel universe where clouds taste like cotton candy.",
    "Alien jazz band jams with whales.",
    'Happy images',
    'Successful Project',
    'Fisk university',
    'Happy Professor',
    'Pizza in soccer'
  ]

  const mysteryBox = () => {
    setImages(null)
    const randomValue = mysteryOptions[Math.floor(Math.random() * mysteryOptions.length)]
    setValue(randomValue)
  }

  const getImages = async () => {
    setImages(null)
    if (value === null) {
      setError('Error! Must have a search term')
      return
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value
        }),
        headers: {
          "Content-type": "application/json" 
        }
      }
      const response = await fetch('http://localhost:4000/images', options)
      const data = await response.json()
      console.log(data)
      setImages(data)
    } catch (error) {
      console.error(error)
      
    }
  }

  const uploadImage = async(e) => {

    // console.log(e.target.files[0])

    const formData = new FormData()
    formData.append('file', e.target.files[0])
    setModalOpen(true)
    setSelectedImage(e.target.files[0])
    e.target.value = null

    try {
      const options = {
        method: "POST",
        body: formData
      }
      const response = await fetch('http://localhost:4000/upload', options)
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  const generateVariations = async () => {
    setImages(null)
    if (selectedImage === null) {
      setError('Error! Must have an existing image')
      setModalOpen(false)
      return
    }
    try {
      const options = {
        method: 'POST'
      }
      const response = await fetch('http://localhost:4000/variations', options)
      const data = await response.json()
      console.log(data)
      setImages(data)
      setError(null)
      setModalOpen(false)
    }catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="app">
      <section className="search-section">
        <p>Search the images you want with the detailed description 
          <span className="mystery" onClick={mysteryBox}>Mystery Box</span>
        </p>
        <div className="input-container">
          <input value={value} placeholder="Your wild imagination are sketched if you can put them in words"
          onChange={e => setValue(e.target.value)}
          />
          <button onClick={getImages}>Generate</button>
        </div>
        <p className="extra-info">
          <span>
            <label htmlFor="files">upload an image </label>
            <input onChange={uploadImage} id="files" accept="image/*" type="file" hidden/>
          </span>
            to edit.
        </p>
        {error && <p>{error}</p>}
        {modalOpen && <div className="overlay">
          <Modal
           setModalOpen={setModalOpen}
           setSelectedImage={setSelectedImage} 
           selectedImage={selectedImage} 
           generateVariations={generateVariations}
          />
        </div>}
      </section>
      <section className="image-section">
      {images?.map((image, _index) => (
          <img key={_index} src={image.url} alt={`Generated image of ${value}`}/>
      ))}
      </section>
    </div>
  )
}

export default App