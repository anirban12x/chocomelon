import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
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
    <div>
    <div className="flex justify-center">
      {items.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <div key={idx} className="relative flex w-80 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md my-5">
              <div class="relative mx-4 -mt-6 h-42 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r from-blue-500 to-blue-600">
              <Card.Img variant="top" src={item.image} />
              </div>
              <div class="p-6">
                <h5 class="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                 {item.name}
                </h5>
                <p class="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                {item.description}
                </p>
              </div>
              <div className='flex flex-row justify-between px-6 mb-4'>
                <div className='flex flex-col w-max'>
                <p className=" font-sans text-base font-light leading-relaxed text-inherit antialiased">
                Created by
                </p>
                <p className=" font-sans text-black leading-relaxed antialiased">
                {item.seller.slice(0,5)+'...'+item.seller.slice(38,42)}
                </p>
                </div>
                <div className='flex flex-col w-max'>
                <p class=" font-sans text-base font-light leading-relaxed text-inherit antialiased">
                Current Price
                </p>
                <p class=" font-sans text-black leading-relaxed antialiased">
                {ethers.utils.formatEther(item.totalPrice)} ETH
                </p>
                </div>
              </div>
              <div class="p-6 pt-0">
                <button onClick={() => buyMarketItem(item)} data-ripple-light="true" type="button" class="select-none rounded-lg bg-blue-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                  Place Bid
                </button>
              </div>
            </div>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
    {/* */}
    </div>
  );
}

export default Home

{/*  <Col key={idx} className="">
                
               <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card> 
              </Col> */}