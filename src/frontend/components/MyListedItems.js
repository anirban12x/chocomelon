import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card } from 'react-bootstrap'

const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

export default function MyListedItems({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  const [soldItems, setSoldItems] = useState([])

  const loadListedItems = async () => {
    try {
      // Load all sold items that the user listed
      const itemCount = await marketplace.itemCount()
      let listedItems = []
      let soldItems = []
      for (let indx = 1; indx <= itemCount; indx++) {
        const i = await marketplace.items(indx)
        if (i.seller.toLowerCase() === account) {
          // get uri url from nft contract
          const uri = await nft.tokenURI(i.tokenId)
          // use uri to fetch the nft metadata stored on ipfs 
          const ipfsUrl = uri.replace("ipfs://", IPFS_GATEWAY);
          const response = await fetch(ipfsUrl)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const metadata = await response.json()
          // get total price of item (item price + fee)
          const totalPrice = await marketplace.getTotalPrice(i.itemId)
          // define listed item object
          let item = {
            totalPrice,
            price: i.price,
            itemId: i.itemId,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image.replace("ipfs://", IPFS_GATEWAY)
          }
          // Add listed item to sold items array if sold
          if (i.sold) soldItems.push(item)
          // Add listed item to listed items array if not sold
          else listedItems.push(item)
        }
      }
      setListedItems(listedItems)
      setSoldItems(soldItems)
    } catch (error) {
      console.error("Failed to load listed items:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadListedItems()
  }, [])

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )

  return (
    <div className="flex justify-center">
      {listedItems.length > 0 || soldItems.length > 0 ? (
        <div className="px-5 py-3 container">
          {listedItems.length > 0 && (
            <>
              <h2>Listed</h2>
              <Row xs={1} md={2} lg={4} className="g-4 py-3">
                {listedItems.map((item, idx) => (
                  <Col key={idx} className="overflow-hidden">
                    <Card>
                      <Card.Img variant="top" src={item.image} />
                      <Card.Body color="secondary">
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text>{item.description}</Card.Text>
                      </Card.Body>
                      <Card.Footer>
                        <div className='d-grid'>
                          <Card.Text>
                            Price: {ethers.utils.formatEther(item.totalPrice)} ETH
                          </Card.Text>
                        </div>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
          {soldItems.length > 0 && renderSoldItems(soldItems)}
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed assets</h2>
        </main>
      )}
    </div>
  );
}

function renderSoldItems(soldItems) {
  return (
    <>
      <h2>Sold</h2>
      <Row xs={1} md={2} lg={4} className="g-4 py-3">
        {soldItems.map((item, idx) => (
          <Col key={idx} className="overflow-hidden">
            <Card>
              <Card.Img variant="top" src={item.image} />
              <Card.Body color="secondary">
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <div className='d-grid'>
                  <Card.Text>
                    Total Price: {ethers.utils.formatEther(item.totalPrice)} ETH
                  </Card.Text>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}