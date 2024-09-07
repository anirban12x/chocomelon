import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'

import Top from './Top/Top.jsx'
import Collection from './Collection/Collection.jsx'
import icon from '../asset/eth4 - Copy (2).png'
import './Discover.css'

const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  const loadMarketplaceItems = async () => {
    try {
      // Load all unsold items
      const itemCount = await marketplace.itemCount()
      let items = []
      for (let i = 1; i <= itemCount; i++) {
        const item = await marketplace.items(i)
        if (!item.sold) {
          // get uri url from nft contract
          const uri = await nft.tokenURI(item.tokenId)
          // use uri to fetch the nft metadata stored on ipfs 
          const ipfsUrl = uri.replace("ipfs://", IPFS_GATEWAY);
          const response = await fetch(ipfsUrl)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const metadata = await response.json()
          // get total price of item (item price + fee)
          const totalPrice = await marketplace.getTotalPrice(item.itemId)
          // Add item to items array
          items.push({
            totalPrice,
            itemId: item.itemId,
            seller: item.seller,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image.replace("ipfs://", IPFS_GATEWAY)
          })
        }
      }
      setItems(items)
    } catch (error) {
      console.error("Failed to load marketplace items:", error)
    } finally {
      setLoading(false)
    }
  }

  const buyMarketItem = async (item) => {
    try {
      await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
      await loadMarketplaceItems()
    } catch (error) {
      console.error("Failed to purchase item:", error)
    }
  }

  useEffect(() => {
    loadMarketplaceItems()
  }, [])

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )

  return (
    <>
    <Top/>
    <Collection/>
    <div className='app__discover section__padding'>
      <div className="app__discover-head">
        <h1 className='h1__font2 w-max border-b-4 border-b-orange-400 pb-2'>DISCOVER MORE PRODUCTS</h1>
      </div>
      <div className="app__discover-content">
      {items.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-3 w-full">
            {items.map((item, idx) => (

              <div className='app__discover_card' key={idx}>
    <div className="app__discover_card_head">
      <img className='nft__images' src={item.image} alt="NFT Images" />
    </div>
    <div className="app__discover_card_description">
      <h1 className='h2__font1'>{item.name}</h1>
      <p className='p__font1 text-lg'>{item.description}</p>
      <div className='description_bid mt-2'>
        <div className='bid'>
          <img src={icon} alt="Etherum Icon" />
          <p className='p__font1'>{ethers.utils.formatEther(item.totalPrice)}</p>
        </div>
      </div>
    </div>
    <div className='app__discover_card_times'>
      <a href="#">
        <btn onClick={() => buyMarketItem(item)}>Buy Now</btn>
      </a>
    </div>
  </div>
            ))}
          </Row>
        </div>
        : (
          <main className='w-full text-center py-12 my-12'>
            <h2>No listed assets</h2>
          </main>
        )}
      </div>
      <div className="app__discover-button">
      </div>
    </div>
    </>
  );
}

export default Home

              // <Col key={idx} className="overflow-hidden">
              //   <Card>
              //     <Card.Img variant="top" src={item.image} />
              //     <Card.Body color="secondary">
              //       <Card.Title>{item.name}</Card.Title>
              //       <Card.Text>
              //         {item.description}
              //       </Card.Text>
              //     </Card.Body>
              //     <Card.Footer>
              //       <div className='d-grid'>
              //         <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
              //           Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
              //         </Button>
              //       </div>
              //     </Card.Footer>
              //   </Card>
              // </Col>