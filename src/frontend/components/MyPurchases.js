import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card } from 'react-bootstrap'

const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState([])

  const loadPurchasedItems = async () => {
    try {
      // Fetch purchased items from marketplace by querying Offered events with the buyer set as the user
      const filter = marketplace.filters.Bought(null, null, null, null, null, account)
      const results = await marketplace.queryFilter(filter)
      //Fetch metadata of each nft and add that to listedItem object.
      const purchases = await Promise.all(results.map(async i => {
        // fetch arguments from each result
        i = i.args
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
        // define purchased item object
        let purchasedItem = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image.replace("ipfs://", IPFS_GATEWAY)
        }
        return purchasedItem
      }))
      setPurchases(purchases)
    } catch (error) {
      console.error("Failed to load purchased items:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPurchasedItems()
  }, [])

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )

  return (
    <>
      {purchases.length > 0 ?
        <div className='app__discover section__padding'>
           <div className="app__discover-head">
        <h1 className='h1__font2 w-max border-b-4 border-b-orange-400 pb-2'>My Purchases</h1>
      </div>
          <div className='app__discover-content'>
            <div className="px-5 container">
              <Row xs={1} md={2} lg={4} className="g-4 py-5">
                {purchases.map((item, idx) => (
                  <Col key={idx} className="overflow-hidden">
                    <Card>
                      <Card.Img variant="top" src={item.image} />
                      <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text>{item.description}</Card.Text>
                      </Card.Body>
                      <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </div>
        : (
          <div className='app__discover section__padding'>
          <div className="app__discover-content">
          <main className='w-full text-center py-12 my-12'>
            <h2>No purchases made yet</h2>
          </main></div></div>
        )}
    </>
  );
}