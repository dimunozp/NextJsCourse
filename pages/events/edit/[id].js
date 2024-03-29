import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { FaImage } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import Modal from "@/components/Modal";
import ImageUpload from "@/components/ImageUpload";
import { API_URL } from "@/config/index";
import styles from "@/styles/Form.module.css";
import { get } from "lodash";
import Image from "next/image";
import { parseCookies } from "@/helpers/index";

export default function EditEventPage({ evt, token }) {
    const [values, setValues] = useState({
        name: evt.attributes.name,
        performers: evt.attributes.performers,
        venue: evt.attributes.venue,
        address: evt.attributes.address,
        date: evt.attributes.date,
        time: evt.attributes.time,
        description: evt.attributes.description,
    });

    const [imagePreview, setImagePreview] = useState(
        get(evt, "attributes.image")
            ? get(evt, "attributes.image.data.attributes.url")
            : null
    );

    const [showModal, setShowModal] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const hasEmptyFields = Object.values(values).some(
            (element) => element === ""
        );

        if (hasEmptyFields) {
            toast.error("Please fill in all fields");
        }

        const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                data: {
                    ...values,
                },
            }),
        });

        if (!res.ok) {
            if (res.status === "403" || res.status === "401") {
                toast.error("Unauthorized");
                return;
            }
            toast.error("Something Went Wrong");
        } else {
            const evt = await res.json();
            router.push(`/events/${evt.slug}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const imageUploaded = async (e) => {
        const res = await fetch(`${API_URL}/api/events/${evt.id}?populate=*`);
        const data = await res.json();
        setImagePreview(data.data.attributes.image.data.attributes.url);
        setShowModal(false);
    };

    return (
        <Layout title="Edit Event">
            <Link href="/events">Go Back</Link>
            <h1>Edit Event</h1>
            <ToastContainer />
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                    <div>
                        <label htmlFor="name">Event Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={values.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="performers">Performers</label>
                        <input
                            type="text"
                            id="performers"
                            name="performers"
                            value={values.performers}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="venue">Venue</label>
                        <input
                            type="text"
                            id="venue"
                            name="venue"
                            value={values.venue}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={values.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={moment(evt.attributes.date).format(
                                "yyyy-MM-DD"
                            )}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="time">Time</label>
                        <input
                            type="text"
                            id="time"
                            name="time"
                            value={values.time}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="description">Event Description</label>
                    <textarea
                        type="text"
                        id="description"
                        name="description"
                        value={values.description}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <input type="submit" value="Update Event" className="btn" />
            </form>
            <h2>Event Image</h2>
            {imagePreview ? (
                <Image src={imagePreview} height={100} width={170} />
            ) : (
                <div>
                    <p>No image uploaded</p>
                </div>
            )}

            <div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-secondary"
                >
                    <FaImage /> Set Image
                </button>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <ImageUpload
                    evtId={evt.id}
                    imageUploaded={imageUploaded}
                    token={token}
                />
            </Modal>
        </Layout>
    );
}

export async function getServerSideProps({ params: { id }, req }) {
    const res = await fetch(`${API_URL}/api/events/${id}?populate=*`);
    const evt = await res.json();
    const { token } = parseCookies(req);

    return {
        props: {
            evt: evt.data,
            token,
        },
    };
}
