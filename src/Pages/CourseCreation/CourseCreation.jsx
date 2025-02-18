import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { RiGalleryUploadFill } from "react-icons/ri";
import { useDropzone } from "react-dropzone";
import "./CourseCreation.css";
import { BASE_URI } from "../../Config/url";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "../../Components/Modal/Modal";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";
import { PulseLoader } from "react-spinners";
import { MdDone } from "react-icons/md";

const tagsData = ['JavaScript', 'React', 'CSS', 'HTML', 'Node.js', 'Python', 'Java', "i", "i"];
export default function CourseCreation({ editCourse, courseeId }) {
  
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category_id: "",
    status: "",
    price: "",
    discount: "",
    thumbnail: null,
    tag_ids: [],
    access: "",
  });
  const [isModal, setIsModal] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const editorRef = useRef(null);
  const token = localStorage.getItem("token");
  const [showPopover, setShowPopover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [finalDelete, setFinalDelete] = useState(false);
  const [isLoadingDeleteCourse, setIsLoadingDeleteCourse] = useState(false);
  const tagsUrl = `${BASE_URI}/api/v1/tags`;
  const categoriesUrl = `${BASE_URI}/api/v1/category`;
  const fetchOptions = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Function to fetch tags based on search
  const fetchTags = async () => {
    if (searchTerm) {
      try {
        const response = await axios.get(`${BASE_URI}/api/v1/tags?search=${searchTerm}`, fetchOptions);
    
        setTags(response?.data?.data); // Adjust based on your API response structure
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    } else {
      setTags([]); // Clear tags if search term is empty
    }
  };

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchTags();
    }, 300); // Debounce to reduce API calls

    return () => clearTimeout(debounceFetch);
  }, [searchTerm]);

  // Function to handle tag selection
  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  // Function to remove a tag from selected
  const handleTagRemove = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };



  const navigate = useNavigate();

  const { data } = useFetch(tagsUrl, fetchOptions);
  const gettags = useMemo(() => data?.data || [], [data]);
  
  // useEffect(()=>{
  //   setSelectedTags(gettags)
  // })
  const { data: categoriesData } = useFetch(categoriesUrl, fetchOptions);
  const categories = useMemo(
    () => categoriesData?.data || [],
    [categoriesData]
  );

  useEffect(() => {
    if (editCourse) {
      axios
        .get(`${BASE_URI}/api/v1/courses/${courseeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const courseDetails = response?.data?.data[0];
        
          // Ensure both course details and gettags are available before sorting
          if (courseDetails?.tag_ids && gettags.length > 0) {
            const sortedTags = courseDetails.tag_ids
              .map((tagId) => {
                const tag = gettags.find((tag) => tag.id === tagId);
                return tag ? { id: tag.id, name: tag.name } : null;
              })
              .filter((tag) => tag !== null); // Remove any null values
  
            setSelectedTags(sortedTags);
          }
  
          setCourseData({
            title: courseDetails.title || "",
            description: courseDetails.description || "",
            category_id: courseDetails.category_id || "",
            status: courseDetails.status || "",
            price: courseDetails.price || "",
            discount: courseDetails.discount || "",
            thumbnail: courseDetails.thumbnail || null,
            tag_ids: courseDetails.tag_ids || [],
            access: courseDetails.access || "",
          });
  
          setThumbnailPreview(
            courseDetails.thumbnail ? courseDetails.thumbnail : null
          );
        })
        .catch(() => {
          toast.error("Failed to load course details.");
        });
    }
  }, [editCourse, courseeId, token, gettags]);
  

  useEffect(()=>{
    
  },[])

  const handleChange = (event) => {
    setShowPopover(false);
    const { name, value } = event.target;
    if (name === "tag_ids") {
      setCourseData((prevData) => ({
        ...prevData,
        tag_ids: [...event.target.selectedOptions].map(
          (option) => option.value
        ),
      }));
    } else {
      setCourseData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        toast.success("File uploaded successfully!");
        setCourseData((prevData) => ({
          ...prevData,
          description: e.target.result,
        }));
      };
      reader.onerror = () => toast.error("Failed to read file.");
      reader.readAsText(file);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setCourseData((prevData) => ({
          ...prevData,
          thumbnail: file,
        }));
      }
    },
    [setCourseData]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleEditorChange = (content) => {
    const sanitizedContent = DOMPurify.sanitize(content); // Sanitize HTML
    setCourseData((prevData) => ({
      ...prevData,
      description: sanitizedContent,
    }));
  };

  const handleTagChange = (e) => {
    const selectedOptions = [...e.target.selectedOptions].map(
      (option) => option.value
    );

    setCourseData({
      ...courseData,
      tag_ids: selectedOptions,
    });
  };

  const handleCancel = () => {
    setCourseData({
      title: "",
      description: "",
      category_id: "",
      status: "",
      price: "",
      discount: "",
      thumbnail: null,
      tag_ids: [],
      access: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const dataToSend = {
      ...courseData,
      tag_ids: selectedTags.map(tag => tag.id), // Assuming tag has an 'id' property
    };
    await axios
      .post(`${BASE_URI}/api/v1/courses`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
       
        setCourseId(response.data.data.course_id);
        setIsModal(true);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleCreateTag = async () => {
    await axios.post(`${BASE_URI}/api/v1/tags`, { name: searchTerm }, fetchOptions).then((res) => {
      toast.success("tag added succussfully")
      fetchTags()
    }).catch((err) => {
      toast.err("failed to add toast")
    })
  }

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setLoading(true);
    const dataToSend = {
      ...courseData,
      tag_ids: selectedTags.map(tag => tag.id), // Assuming tag has an 'id' property
    };
    axios
      .patch(`${BASE_URI}/api/v1/courses/${courseeId}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setLoading(false);
        toast.success("Course updated successfully!");
        setCourseId(response.data.data.course_id);
        setIsModal(true);
        navigate("/courses");
      })
      .catch((error) => {
        setLoading(false);
        // toast.error(
        //   error.response ? error.response.data.message : "Something went wrong"
        // );
      });
  };

  const handleDeleteCourse = () => {
    setIsLoadingDeleteCourse(true);
    axios
      .delete(
        `${BASE_URI}/api/v1/courses/${courseeId}`,

        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(() => {
        setIsLoadingDeleteCourse(false);
        toast.success("Course deleted successfully");

        setFinalDelete(true);
        setIsDelete(false);
      })
      .catch((err) => {
        setIsLoadingDeleteCourse(false);
        toast.error(
          err.response ? err.response.data.message : "Something went wrong"
        );
      });
  };

  const handleFocus = () => {
    setShowPopover(true);
  };
  const closeModal = () => {
    setIsDelete(false);
  };

  const handleFinalDelete = () => {
    setFinalDelete(false);
    navigate("/courses");
  };

  return (
    <div className="w-100">
      <header className="d-flex align-items-center justify-content-between py-3">
        <h3 className="fw-bold">Course Creation</h3>
        <button className="signup-now py-2 px-3 fw-lightBold mb-0 h-auto">
          <Link to="/courses" className="text-decoration-none text-white">
            Cancel
          </Link>
        </button>
      </header>
      <main className="custom-box p-md-5 p-3">
        <form action="newCourse" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="d-block mb-1 fs-5 fw-light">
              Course Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={courseData.title}
              onChange={handleChange}
              placeholder="Enter Title"
              className="px-5 py-2-half-5 border-secondary-subtle border rounded-2 w-100 input-custom"
              required
            />
          </div>
          <div className="mb-3">
            <div className="d-flex justify-content-between ">
              <label
                htmlFor="text_content"
                className="d-block mb-1 fs-5 fw-light"
              >
                Course Description <span className="text-danger">*</span>
              </label>
              <div className="cursor-pointer">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  id="uploadFile"
                />
                <label htmlFor="uploadFile" className="fs-small neutral-color">
                  <RiGalleryUploadFill className="fs-5 me-2" />
                  Upload .txt file
                </label>
              </div>
            </div>
            <div className="border border-secondary-subtle rounded">
              <ReactQuill
                value={courseData.description}
                name="description"
                onChange={handleEditorChange}
                ref={editorRef}
                theme="snow"
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["bold", "italic", "underline"],
                    [{ color: [] }, { background: [] }],
                    [{ align: [] }],
                    ["clean"],
                  ],
                }}
                formats={[
                  "header",
                  "font",
                  "list",
                  "bullet",
                  "bold",
                  "italic",
                  "underline",
                  "color",
                  "background",
                  "align",
                ]}
                style={{ height: "13rem", overflowY: "auto" }}
                placeholder="Write course description here..."
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="category_id" className="d-block mb-1 fs-5 fw-light">
              Course Category <span className="text-danger">*</span>
            </label>
            <select
              className="px-5 py-2-half-5 border-secondary-subtle border rounded-2 w-100"
              name="category_id"
              value={courseData.category_id}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select
              </option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="d-block mb-1 fs-5 fw-light">
              Course Status <span className="text-danger">*</span>
            </label>
            <select
              className="px-5 py-2-half-5 border-secondary-subtle border rounded-2 w-100"
              name="status"
              value={courseData.status}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select
              </option>
              <option value="active">Active</option>
              <option value="inActive">In Active</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="tag_ids" className="d-block mb-1 fs-5 fw-light">
              Select Tags <span className="text-danger">*</span>
            </label>
            <div className="container mt-4">
  <span style={{ display: "flex", gap: "1rem" }}>
    <input
      type="text"
      placeholder="Search tags..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="px-5 py-2-half-5 border-secondary-subtle border rounded-2 w-100"
      style={{ borderColor: "#007bff", borderWidth: "2px" }}
    />
    {tags.length === 0 && searchTerm !== "" && (
      <div
        style={{
          border: "1px solid #007bff",
          cursor: "pointer",
          padding: "0.3rem 0.6rem",
          borderRadius: "0.5rem",
          backgroundColor: "#007bff",
          color: "white",
          transition: "background-color 0.3s",
        }}
        onClick={handleCreateTag}
        className="text-center"
      >
        Create tag
      </div>
    )}
  </span>

  <div className="row mt-4">
    {tags?.map((tag) => (
      <div
        key={tag.id} // Adjust based on your tag structure
        className={`col-4 mb-2`} // 3 columns layout with Bootstrap
      >
        <div
          className={`tag-item p-2 rounded border ${selectedTags.includes(tag) ? 'bg-primary text-white' : 'bg-light'}`}
          onClick={() => handleTagSelect(tag)}
          style={{ cursor: "pointer", transition: "background-color 0.3s" }}
        >
          {tag.name} {/* Adjust based on your tag structure */}
        </div>
      </div>
    ))}
  </div>

  <div className="selected-tags mt-4 d-flex flex-wrap gap-1">
    {selectedTags.map((tag) => (
      <span key={tag.id} className="badge bg-secondary d-flex align-items-center">
        {tag.name} {/* Adjust based on your tag structure */}
        <button
          onClick={() => handleTagRemove(tag)}
          className="btn-close btn-close-white ms-2"
          aria-label="Close"
        ></button>
      </span>
    ))}
  </div>
</div>

          </div>

          <div className="mb-3">
            <label htmlFor="access" className="d-block mb-1 fs-5 fw-light">
              Access Time <span className="text-danger">*</span>
            </label>
            <select
              className="px-5 py-2-half-5 border-secondary-subtle border rounded-2 w-100"
              name="access"
              value={courseData.access}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select
              </option>
              <option value="lifetime">Lifetime</option>
              {/* <option value="inActive">In Active</option> */}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="thumbnail" className="d-block mb-1 fs-5 fw-light">
              Thumbnail <span className="text-danger">*</span>
            </label>
            <div {...getRootProps()} className="input-group mb-3">
              <input
                type="text"
                name="thumbnail"
                placeholder={
                  courseData.thumbnail
                    ? courseData.thumbnail.name
                    : "Select or Drag & Drop"
                }
                className="form-control px-5 py-2-half-5 border-secondary-subtle border border-end-0 rounded-start-2 input-custom"
                readOnly
                required
              />
              <button
                type="button"
                className="input-group-text border-start-0 bg-white border-secondary-subtle"
              >
                <RiGalleryUploadFill className="fs-5 neutral-color" />
              </button>
              <input
                {...getInputProps({
                  style: { display: "none" },
                })}
              />
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="mt-2"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              )}
            </div>

            <div className="mb-5 d-md-flex align-item-center gap-4">
              <div className="w-md-50 position-relative">
                <label htmlFor="price" className="d-block mb-1 fs-5 fw-light">
                  Price <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <label htmlFor="price" className="input-group-text">
                    $
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={courseData.price}
                    onFocus={handleFocus}
                    onChange={handleChange}
                    placeholder="Enter Price"
                    className="form-control px-5 py-2-half-5 input-custom"
                    required
                  />
                  <span
                    style={{
                      cursor: "pointer",
                      marginLeft: "10px",
                      position: "relative",
                    }}
                  >
                    <i className="bi bi-info-circle"></i>
                    {showPopover && (
                      <div className="custom-popover">
                        15% of this amount will be credited to Admin
                      </div>
                    )}
                  </span>
                </div>
                <style jsx>{`
                  .custom-popover {
                    position: absolute;
                    top: -40px;
                    right: 114px;
                    background-color: #333;
                    color: #fff;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    white-space: nowrap;
                    z-index: 1000;
                  }
                `}</style>
              </div>
              <div className="w-md-50">
                <label
                  htmlFor="discount"
                  className="d-block mb-1 fs-5 fw-light"
                >
                  Discount <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <label htmlFor="discount" className="input-group-text">
                    %
                  </label>
                  <input
                    type="text"
                    name="discount"
                    value={courseData?.discount}
                    onChange={handleChange}
                    placeholder="Enter Discount"
                    className="form-control px-5 py-2-half-5 input-custom"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {editCourse ? (
            <div className="d-flex justify-content-between align-items-center">
              <button
                type="button"
                className="signup-now py-2 px-3 fw-light mb-0 h-auto"
                style={{ background: "#CC3737" }}
                // onClick={handleCancelEdit}
                onClick={() => setIsDelete(true)}
              >
                Delete
              </button>
              <button
                type="submit"
                className="signup-now py-2 px-3 fw-light mb-0 h-auto"
                onClick={handleSaveChanges}
              >
                {loading ? (
                  <PulseLoader size={8} color="white" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <button
                type="button"
                className="signup-now py-2 px-3 fw-light mb-0 h-auto"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="signup-now py-2 px-3 fw-light mb-0 h-auto"
              >
                {loading ? (
                  <PulseLoader size={8} color="white" />
                ) : (
                  "Add Course"
                )}
              </button>
            </div>
          )}
        </form>
      </main>

      <Modal
        show={isModal}
        // onClose={closeModal}
        btnName="Continue"
        path={`/courses/addLesson/${courseId}`}
      >
        <div className="p-4 text-center">
          <h5>Your Course has been successfully created!</h5>
        </div>
      </Modal>

      <Modal onClose={closeModal} show={isDelete}>
        <div className="p-3 text-center">
          <h5 className="mb-4">Are you sure to delete the course?</h5>
          <div className="d-flex align-items-center justify-content-center gap-5">
            <button
              className="signup-now py-2 px-3 fw-light mb-0 h-auto"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="signup-now py-2 px-3 fw-light mb-0 h-auto"
              onClick={handleDeleteCourse}
            >
              {isLoadingDeleteCourse ? (
                <PulseLoader size={8} color="white" />
              ) : (
                " Continue"
              )}
            </button>
          </div>
        </div>
      </Modal>

      <Modal show={finalDelete}>
        <div className="d-flex flex-column align-items-center gap-3 justify-content-center">
          <MdDone className="fs-1" />
          <h5>Lesson deleted successfully.</h5>
          <button
            className="signup-now px-3 fw-lightBold mb-0 h-auto py-2"
            onClick={handleFinalDelete}
          >
            Continue
          </button>
        </div>
      </Modal>
    </div>
  );
}
