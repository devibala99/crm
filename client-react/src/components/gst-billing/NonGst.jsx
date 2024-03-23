/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import "./gst.css"
import numberToWords from 'number-to-words';
import logoimg from "./assets/kitkat-removebg-preview.png"
import { showClients } from '../features/clientSlice';
import { useDispatch, useSelector } from 'react-redux';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
const NonGst = () => {

    const dispatch = useDispatch();
    // fetch client name from store
    useEffect(() => {
        dispatch(showClients());
    }, [dispatch]);
    useEffect(() => {
        const textarea = document.querySelector('.autogrow-input');
        if (textarea) {
            textarea.addEventListener('input', function () {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        }
    }, []);
    const [isPrintClicked, setIsPrintClicked] = useState(false);
    const clientList = useSelector(state => state.clients.clientEntries);
    const [clientNameCurrent, setClientNameCurrent] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [selectedClient, setSelectedClient] = useState({
        clientName: '',
        address: '',
        date: '',
        inVoice_no: '',
        phoneNumber: '',
        gst_in: '33BIQPA2943B1ZQ',
    });
    const [isPrint, setIsPrint] = useState(false);
    const [newRow, setNewRow] = useState([
        { description: "", quantity: "", unitPrice: "", totalAmount: 0 },
    ]);

    // today date
    const currentDate = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = currentDate.toLocaleDateString('en-GB', options);
    // handle input changes to create new row in table
    const handleInputChanges = (e, index, entry) => {
        const { value } = e.target;
        const addRow = [...newRow];
        addRow[index][entry] = value;
        if (entry === "quantity" || entry === "unitPrice") {
            const quantity = parseFloat(addRow[index].quantity) || 0;
            const unitPrice = parseFloat(addRow[index].unitPrice) || 0;
            addRow[index].totalAmount = quantity * unitPrice;
        }
        setNewRow(addRow);
    }
    const handleNewRow = () => {
        const tmpS_no = newRow.length + 1;
        setNewRow([
            ...newRow,
            {
                sno: tmpS_no,
                description: "",
                quantity: '',
                unitPrice: '',
                totalAmount: 0,
            }
        ]);
    };

    const handleDeleteRow = (index) => {
        const filteredRows = [...newRow];
        filteredRows.splice(index, 1);
        setNewRow(filteredRows);
    }

    const handleClientSelect = (e) => {
        const selectedClientName = e.target.value;
        setClientNameCurrent(selectedClientName);
        const client = clientList.find(client => client.clientName === selectedClientName);
        setSelectedClient(client);
    }
    const totalSum = () => {
        return newRow.reduce((acc, row) => acc + row.totalAmount, 0);
    }
    const finalTotalWords = numberToWords.toWords(totalSum()).toUpperCase();
    const printDunc = () => {
        console.log("---", newRow);
        setIsPrintClicked(true);
        window.print();
    }
    return (
        <div className='printGST_container'>
            <div className="bill_header_segment">
                <div className="segment_left">
                    <div className="bill_heading">
                        <h1>ESTIMATED BILL</h1>
                        <h3>KITKAT SOFTWARE TEECHNOLOGIES</h3>
                    </div>
                    <div className="bill_address">
                        <h4 style={{ lineHeight: '1.5' }}>
                            No: 70/77 , 1st Floor, Krishna complex, PN Palayam <br />
                            Coimbatore-641037 <br />
                            Phone No : 7010816299 , 04224957272.
                        </h4>
                    </div>

                    <div className="bill_invoiceTo">
                        <div className="select-name" data-selected-option={clientNameCurrent} style={{ margin: "0", padding: "0" }}>
                            <h4 style={{ margin: "0", padding: "0" }}>INVOICE TO:</h4> &nbsp;
                            <select value={clientNameCurrent} onChange={handleClientSelect} name='emp_name' style={{ width: "200px", fontWeight: "bold", margin: "0", padding: "0", fontSize: "1rem" }}>
                                <option value="" style={{ width: "200px" }}>Select a Client</option>
                                {clientList.map(client => (
                                    <option key={client.id} value={client.clientName} style={{ width: "200px", margin: "0", padding: "0" }}>
                                        {client.clientName}
                                    </option>
                                ))}
                            </select>

                        </div>
                        <div className="client-detail" style={{ margin: "0", padding: "0" }}>
                            {selectedClient && (
                                <div style={{ width: "60%", margin: "0", padding: "0" }}>
                                    <h4 style={{ margin: "0", padding: "0" }}>{selectedClient.address}
                                        <br />
                                        {selectedClient.state}
                                    </h4>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="segment-right">
                    <div className="logo-img">
                        <img src={logoimg} alt="logo" />
                    </div>
                    <div className="date-field">
                        <h4 className='text'>DATE:</h4>
                        <h4 className='date'> {formattedDate}</h4>
                    </div>
                    <div className="invoice-field">
                        <h4><span style={{ fontWeight: "bold" }}>INVOICE NO:</span>{selectedClient.inVoice_no}</h4>
                        <h4><span style={{ fontWeight: "bold" }}>GSTIN:</span>33BIQPA2943B1ZQ</h4>
                    </div>
                </div>
            </div>
            <div className="table_gst">
                {
                    isPrint ? (
                        <table className={isPrint ? "table-print" : "table_inputs"} style={{ display: isPrint ? "block" : "none", border: "1px solid red" }}>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>DESCRIPTION</th>
                                    <th>QUANTITY</th>
                                    <th>UNIT PRICE</th>
                                    <th>TOTAL AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newRow.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.description}</td>
                                        <td>{row.quantity}</td>
                                        <td>{row.unitPrice}</td>
                                        <td>{row.totalAmount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (

                        <table className={isPrint ? "table_inputs" : "table-print"} style={{ display: isPrint ? "none" : "block" }}>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>DESCRIPTION</th>
                                    <th>QUANTITY</th>
                                    <th>UNIT PRICE</th>
                                    <th>TOTAL AMOUNT</th>
                                    <th className="print_remove">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newRow.map((row, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <textarea
                                                name={`description${index}`}
                                                value={row.description}
                                                onChange={(e) => handleInputChanges(e, index, "description")}
                                                className={isPrintClicked ? 'transparent-border' : ''}
                                                style={{ width: "100%", resize: "none" }}
                                            />

                                        </td>
                                        <td>
                                            <input type="number" name={`quantity${index}`} value={row.quantity}
                                                onChange={(e) => handleInputChanges(e, index, "quantity")}
                                                style={{ textAlign: "center" }}
                                            />
                                        </td>
                                        <td>
                                            <input type="number" name={`unitPrice${index}`} value={row.unitPrice}
                                                onChange={(e) => handleInputChanges(e, index, "unitPrice")}
                                            />
                                        </td>
                                        <td>
                                            <input type="text" name={`totalAmount${index}`} value={row.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                onChange={(e) => handleInputChanges(e, index, "totalAmount")}
                                                style={{ textAlign: "center" }}
                                                readOnly
                                            />
                                        </td>
                                        <td className="print_remove">
                                            {index === newRow.length - 1 ? (
                                                <button className="btn btn-add" onClick={handleNewRow}>
                                                    <AddCircleIcon />
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-remove"
                                                    onClick={() => handleDeleteRow(index)}
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="two-detail">
                                    <td className='empty-cell'></td>
                                    <td className='empty-cell'></td>
                                    <td className='empty-cell'></td>
                                    <td className='visible-cell'>TOTAL</td>
                                    <td className='visible-cell-border'>
                                        <input type="text"
                                            name="subTotal"
                                            value={totalSum().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ` INR`}
                                            style={{ color: "red" }}
                                            readOnly />
                                    </td>
                                    <td className='empty-cell'></td>
                                </tr>

                            </tbody>
                        </table>
                    )
                }

            </div>
            <div className='money_in_words'>
                <p style={{ fontSize: "1rem" }}>
                    <span style={{ fontSize: "1rem" }}>Total (In Words) : </span>
                    &emsp;
                    {finalTotalWords}
                </p>
            </div>

            <div className="bank-details">
                <div className="details">
                    <h2>Bank Account Details</h2>
                    <p style={{ fontSize: "1rem" }}>
                        <span style={{ fontSize: "1rem" }}>Bank</span>
                        &emsp;&emsp;&emsp;&emsp;&nbsp;:&emsp;
                        Federal Bank
                    </p>
                    <p style={{ fontSize: "1rem" }}>
                        <span style={{ fontSize: "1rem" }}>Account No</span>
                        &nbsp;&nbsp;&nbsp;:&emsp;
                        19829200003697
                    </p>
                    <p style={{ fontSize: "1rem" }}>
                        <span style={{ fontSize: "1rem" }}>IFSC Code</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &emsp;
                        FDRL0001982
                    </p>
                    <p style={{ fontSize: "1rem" }}>
                        <span style={{ fontSize: "1rem" }}>Branch</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&emsp;&emsp;: &emsp;
                        Papanaickenpalayam
                    </p>

                </div>
                <div className="print-submit">
                    <button onClick={printDunc} className='print-btn'>Print</button>
                </div>
            </div>
            <div className='thank-div'><h2>THANK YOU FOR YOU BUSINESS!</h2></div>
        </div>
    )
}

export default NonGst

