import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { RiGalleryUploadFill } from "react-icons/ri";
import { useDropzone } from "react-dropzone";
import "./CourseEdit.css";
import { BASE_URI } from "../../Config/url";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "../../Components/Modal/Modal";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";
import { PulseLoader } from "react-spinners";
import { MdDone } from "react-icons/md";
import defaultCourse from "../../assets/defaultCourse.png"
import Popup from "../../Components/PopUp/PopUp";
import { TiTickOutline } from "react-icons/ti";
const tagsData = ['JavaScript', 'React', 'CSS', 'HTML', 'Node.js', 'Python', 'Java', "i", "i"];
export default function CourseEdit() {
  // Get course ID from URL params
  const { courseId } = useParams();
  const isEditMode = !!courseId;
  
  console.log("Course ID from URL:", courseId, "Edit mode:", isEditMode);
  
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
  const [newCourseId, setNewCourseId] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const editorRef = useRef(null);
  const token = localStorage.getItem("token");
  const [showPopover, setShowPopover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [finalDelete, setFinalDelete] = useState(false);
  const [isLoadingDeleteCourse, setIsLoadingDeleteCourse] = useState(false);
  const tagsUrl = `${BASE_URI}/api/v1/tags`;
  const categoriesUrl = `${BASE_URI}/api/v1/category/with-subcategories`;
  const fetchOptions = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();

  const { data } = useFetch(tagsUrl, fetchOptions);
  const gettags = useMemo(() => data?.data || [], [data]);
  
  const { data: categoriesData } = useFetch(categoriesUrl, fetchOptions);
  const categories = useMemo(
    () => categoriesData?.data || [],
    [categoriesData]
  );

  // Load course data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      console.log("Fetching course data for editing...");
      axios
        .get(`${BASE_URI}/api/v1/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const courseDetails = response?.data?.data[0];
          console.log("Fetched course details:", courseDetails);
          
          if (courseDetails?.tag_ids && gettags.length > 0) {
            const sortedTags = courseDetails.tag_ids
              .map((tagId) => {
                const tag = gettags.find((tag) => tag.id === tagId);
                return tag ? { id: tag.id, name: tag.name } : null;
              })
              .filter((tag) => tag !== null);
  
            setSelectedTags(sortedTags);
          }
  
          setCourseData({
            title: courseDetails?.title || "",
            description: courseDetails?.description || "",
            category_id: courseDetails?.subcategory_id || courseDetails?.category_id || "",
            status: courseDetails?.status || "",
            price: courseDetails?.price || "",
            discount: courseDetails?.discount || "",
            thumbnail: courseDetails?.thumbnail || null,
            tag_ids: courseDetails?.tag_ids || [],
            access: courseDetails?.access || "",
          });
  
          setThumbnailPreview(courseDetails?.thumbnail || null);
        })
        .catch((error) => {
          console.error("Error fetching course details:", error);
          toast.error("Failed to load course details");
        });
    } else {
      // Reset form for create mode
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
      setSelectedTags([]);
      setThumbnailPreview(null);
    }
  }, [isEditMode, courseId, token, gettags]);

  useEffect(()=>{
    console.log(courseData?.category_id)
  },[courseData?.category_id])

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
    } else if (name === "category_id") {
      setCourseData((prevData) => ({
        ...prevData,
        [name]: Number(value),
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

  const handleCancel = () => {
    navigate("/courses");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const dataToSend = {
      ...courseData,
      tag_ids: selectedTags.map(tag => tag.id),
    };

    try {
      if (isEditMode) {
        // Update existing course
        await axios.patch(
          `${BASE_URI}/api/v1/courses/${courseId}`,
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Course updated successfully!");
        navigate("/courses");
      } else {
        // Create new course
        const response = await axios.post(
          `${BASE_URI}/api/v1/courses`,
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setNewCourseId(response.data.data.course_id);
        setIsModal(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    await axios.post(`${BASE_URI}/api/v1/tags`, { name: searchTerm }, fetchOptions).then((res) => {
      toast.success("tag added succussfully")
      fetchTags()
    }).catch((err) => {
      toast.err("failed to add toast")
    })
  }

  const handleDeleteCourse = () => {
    setIsLoadingDeleteCourse(true);
    axios
      .delete(
        `${BASE_URI}/api/v1/courses/${courseId}`,
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

  const closeSuccessModal = () => {
    setIsModal(false);
    // Navigate to courses page after closing success modal
    navigate("/courses");
  };

  const handleFinalDelete = () => {
    setFinalDelete(false);
    navigate("/courses");
  };

  return (
    <div className="w-100 mb-4">
      <header className="d-flex align-items-center justify-content-between px-2 ps-3 py-2 mt-2 mb-2 app-white">
        <h3 className="fw-semibold fs-5">{isEditMode ? "Edit Course" : "Course Creation"}</h3>
        <button className="app-black rounded-2 border-0 py-1 px-3 fw-lightBold mb-0 h-auto app-black">
          <Link onClick={handleCancel} to="/courses" className="text-decoration-none text-white">
            Cancel
          </Link>
        </button>
      </header>
      <main className="custom-box p-md-5 p-3 app-white mx-2 mb-5">
        <form onSubmit={handleSubmit}>
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
            {/* Category dropdown with main categories (disabled) and selectable subcategories */}
            <select
              className="px-5 py-2-half-5 border-secondary-subtle border rounded-2 w-100"
              name="category_id"
              value={courseData?.category_id}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select
              </option>
              {categories.map((category) => (
                <>
                  <option 
                    className="app-text-black fw-bold" 
                    value={category.category_id} 
                    key={`category-${category.category_id}`}
                    disabled
                  >
                    {category.category_name}
                  </option>
                  {category.subcategories.map((subcategory) => (
                    <option 
                      className="app-text-black ps-4" 
                      value={subcategory.subcategory_id} 
                      key={`subcategory-${subcategory.subcategory_id}`}
                    >
                      {subcategory.subcategory_name}
                    </option>
                  ))}
                </>
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
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultCourse; // Fallback image
                  }}
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

          <div className="d-flex justify-content-between align-items-center">
            {isEditMode ? (
              <>
                <button
                  type="button"
                  className="app-black rounded-1 border-0 app-text-white py-2 px-3 fw-light mb-0 h-auto"
                  onClick={() => setIsDelete(true)}
                >
                  Delete
                </button>
                <button
                  type="submit"
                  className="app-red rounded-1 border-0 app-text-white py-2 px-3 fw-light mb-0 h-auto"
                >
                  {loading ? (
                    <PulseLoader size={8} color="white" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="border-0 rounded-2 app-text-white fw-normal app-black py-2 px-3 fw-light mb-0 h-auto"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="border-0 rounded-2 app-text-white fw-normal app-red py-2 px-3 fw-light mb-0 h-auto"
                >
                  {loading ? (
                    <PulseLoader size={8} color="white" />
                  ) : (
                    "Add Course"
                  )}
                </button>
              </>
            )}
          </div>
        </form>
      </main>
      <Popup isOpen={isModal} onClose={closeSuccessModal} title={"Course Created Success"}>
        <div className="d-flex justify-content-center align-items-center">
          <TiTickOutline style={{fontSize:"4rem"}} className="text-success align-self-center" />
        </div>
      </Popup>
      <Popup isOpen={isDelete} onClose={closeModal} title={"Are you sure to delete the course?"}>
        <div className="d-flex align-items-center justify-content-center gap-5">
          <button
            className="app-black border-0 rounded-1 app-text-white py-2 px-3 fw-light mb-0 h-auto"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="app-red border-0 rounded-1 app-text-white py-2 px-3 fw-light mb-0 h-auto"
            onClick={handleDeleteCourse}
          >
            {isLoadingDeleteCourse ? (
              <PulseLoader size={8} color="white" />
            ) : (
              " Continue"
            )}
          </button>
        </div>
      </Popup>
      <Popup isOpen={finalDelete} onClose={handleFinalDelete} title={"Lesson deleted successfully."}>
        <button
          className="app-red border-0 rounded-1 app-text-white px-3 fw-lightBold mb-0 h-auto py-2"
          onClick={handleFinalDelete}
        >
          Continue
        </button>
      </Popup>
    </div>
  );
}
