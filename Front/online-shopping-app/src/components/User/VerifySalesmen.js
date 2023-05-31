import Nav from "../UI/Nav";
import { useEffect } from "react";
import { getAllSalesmen } from "../../services/UserService"

export default function VerifySalesmen() {

  useEffect(() => {
    getSalesmen();
  }, []);  

  const getSalesmen = async () => {
    await getAllSalesmen();
  }

  return (
    <>
      <Nav></Nav>
      <h1>Verifikacija prodavaca</h1>
    </>
  );
}
