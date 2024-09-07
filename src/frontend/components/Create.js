import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import axios from 'axios'

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const formData = new FormData()
        formData.append("file", file)
  
        console.log('Attempting to upload file to Pinata...');
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            'pinata_api_key': `c3f273d2b8573383a8db`,
            'pinata_secret_api_key': `ceef109481d57718bfcc5f634bfbd445d0b62bfe8e466b8fd6b4cc1160b1d5aa`,
            "Content-Type": "multipart/form-data"
          },
        });
  
        console.log('Pinata response:', resFile.data);
        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        setImage(ImgHash);
      } catch (error){
        console.log("File Upload Error: ", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log("Error data:", error.response.data);
          console.log("Error status:", error.response.status);
          console.log("Error headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log("Error request:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error message:', error.message);
        }
      }
    }
  }

  const createNFT = async () => {
    if (!image || !price || !name || !description) return
    try{
      const metadata = JSON.stringify({
        name, description, image
      });
      const resJSON = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: metadata,
        headers: {
          'pinata_api_key': `${process.env.REACT_APP_PINATA_API_KEY}`,
          'pinata_secret_api_key': `${process.env.REACT_APP_PINATA_API_SECRET}`,
          "Content-Type": "application/json"
        },
      });
      const tokenURI = `ipfs://${resJSON.data.IpfsHash}`;
      mintThenList(tokenURI)
    } catch(error) {
      console.log("JSON Upload Error: ", error)
    }
  }

  const mintThenList = async (tokenURI) => {
    // mint nft 
    await(await nft.mint(tokenURI)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
  }

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <button onClick={createNFT} className='button_1'>
                  Create & List NFT!
                </button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create