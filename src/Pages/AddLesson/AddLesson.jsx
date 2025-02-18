import { FaPen, FaYoutube } from "react-icons/fa";
import { IoMdTrash } from "react-icons/io";
import { MdAddBox, MdDone } from "react-icons/md";
import { BASE_URI } from "../../Config/url";
import "./AddLesson.css"
import useFetch from "../../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { RiGalleryUploadFill } from "react-icons/ri";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { TbDragDrop } from "react-icons/tb";
import Modal from "../../Components/Modal/Modal";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import VideoPlayer from "../../Components/VideoPlayer/VideoPlayer";
import formatTime from "../../utils/formatTime";
import { ShimmerPostDetails } from "react-shimmer-effects";
import { PulseLoader } from "react-spinners";
export default function AddLesson({ setEditCourse, setCourseId }) {
  const [isAddChapter, setIsAddChapter] = useState(false);
  const { id } = useParams();
  const [openForm, setOpenForm] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [editLesson, setEditLesson] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeleteChapter, setIsDeleteChapter] = useState(false);
  const [finalDelete, setFinalDelete] = useState(false);
  const [finalDeleteChapter, setFinalDeleteChapter] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [newLesson, setNewLesson] = useState({
    chapter_id: "",
    title: "",
    video_url: "",
    video_type: "",
    text_content: "",
    duration: "",
    thumbnail: null,
    course_id: id,
  });

  const [newChapterData, setNewChapterData] = useState({
    course_id: id,
    title: "",
  });
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterToDelete, setChapterToDelete] = useState(null);
  const [isLoadingAddLesson, setIsLoadingAddLesson] = useState(false);
  const [isLoadingDeleteLesson, setIsLoadingDeleteLesson] = useState(false);

  const [isLoadingAddChapter, setIsLoadingAddChapter] = useState(false);

  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const courseUrl = `${BASE_URI}/api/v1/courses/${id}`;
  const chaptersUrl = `${BASE_URI}/api/v1/chapters/courseChapters/${id}`;

  const fetchOptions = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const { data } = useFetch(courseUrl, fetchOptions);

  const { title } = data?.data[0] || "";

  const {
    data: chaptersData,
    refetch,
    isLoading,
  } = useFetch(chaptersUrl, fetchOptions);
  const { data: chapters } = chaptersData || [];

  useEffect(() => {
    if (editingChapterId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingChapterId]);

  const handleAddChapter = (e) => {
    e.preventDefault();
    setIsLoadingAddChapter(true);
    axios
      .post(`${BASE_URI}/api/v1/chapters`, newChapterData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((resp) => {
        setIsLoadingAddChapter(false);
        toast.success(resp.data.message);
        setNewChapterData({ title: "", course_id: id });
        refetch();
        setIsAddChapter(false);
      })
      .catch((err) => {
        setIsLoadingAddChapter(false);
        toast.error(err.response ? err.response.data.message : err.message);
      });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (editorRef.current) {
          editorRef.current.getEditor().setText(e.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const fileType = file.type.split("/")[0];

        if (fileType === "image") {
          setFilePreview(URL.createObjectURL(file));
          setNewLesson((prevData) => ({
            ...prevData,
            thumbnail: file,
          }));
        } else if (fileType === "video") {
          setNewLesson((prevData) => ({
            ...prevData,
            video_url: file,
          }));
          setFilePreview(URL.createObjectURL(file));
        } 
      }
    },
    [setNewLesson]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleAddLessonClick = (chapterId, lesson = null) => {
    setOpenForm(openForm === chapterId ? null : chapterId);

    if (lesson) {
      setEditLesson(lesson.id);
      setNewLesson({
        chapter_id: chapterId,
        title: lesson.title,
        video_url: lesson.video_url,
        video_type: lesson.video_type,
        text_content: lesson.text_content,
        duration: lesson.duration,
        thumbnail: lesson.thumbnail,
        course_id: id,
      });
    } else {
      setEditLesson(null);
      setNewLesson({
        chapter_id: chapterId,
        title: "",
        video_url: "",
        video_type: "",
        text_content: "",
        duration: "",
        thumbnail: null,
        course_id: id,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLesson({
      ...newLesson,
      [name]: value,
    });
  };

  const handleEditorChange = (content) => {
    setNewLesson((prevData) => ({
      ...prevData,
      text_content: content,
    }));
  };

  const handleLessonSubmit = (e) => {
    e.preventDefault();
    setIsLoadingAddLesson(true);
    if (newLesson.duration) {
      newLesson.duration = newLesson.duration * 60;
    }

    const url = editLesson
      ? `${BASE_URI}/api/v1/lessons/${editLesson}`
      : `${BASE_URI}/api/v1/lessons`;
    const method = editLesson ? "PATCH" : "POST";

    axios({
      method,
      url,
      data: newLesson,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((resp) => {
        setIsLoadingAddLesson(false);
        setNewLesson({
          chapter_id: "",
          title: "",
          video_url: "",
          video_type: "",
          text_content: "",
          duration: "",
          thumbnail: null,
          course_id: id,
        });

        handleAddLessonClick(null);
        toast.success(resp.data.message);
        setOpenForm(null);
        refetch();
      })
      .catch((err) => {
        setIsLoadingAddLesson(false);
        toast.error(err.response?.data?.message || "Something went wrong");
      });
  };

  const handleDeleteLesson = () => {
    setIsLoadingDeleteLesson(true);
    axios
      .delete(
        `${BASE_URI}/api/v1/lessons/${editLesson}`,

        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((resp) => {
        setIsLoadingDeleteLesson(false);
        toast.success(resp.data.message);
        setEditLesson(null);
        setNewLesson({
          chapter_id: "",
          title: "",
          video_url: "",
          video_type: "",
          text_content: "",
          duration: "",
          thumbnail: null,
          course_id: id,
        });
        setOpenForm(null);
        refetch();
        setFinalDelete(true);
        setIsDelete(false);
      })
      .catch((err) => {
        setIsLoadingDeleteLesson(false);
        toast.error(
          err.response ? err.response.data.message : "Something went wrong"
        );
      });
  };

  const handleSaveChanges = async (chapterId, newTitle, chapterSequence) => {
    try {
      await axios.patch(
        `${BASE_URI}/api/v1/chapters/${chapterId}`,
        {
          courseId: id,
          title: newTitle,
          sequence: chapterSequence,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      refetch();
      toast.success("Chapter updated successfully!");
    } catch (error) {
      toast.error("Error updating chapter!");
    }
  };

  const handleDeleteChapter = () => {
 
    axios
      .delete(`${BASE_URI}/api/v1/chapters`, {
        data: { chapter_id: chapterToDelete, course_id: id },
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((resp) => {
        toast.success(resp.data.message);
        setChapterToDelete(null);
        refetch();
        setIsDeleteChapter(false);
        setFinalDeleteChapter(true);
        if (chapters.length === 1) {
          setIsAddChapter(false);
        }
      })
      .catch(() => {
        toast.error("Error deleting chapter!");
      });
  };

  const handleModalDeleteChapter = (chapterId) => {
    setIsDeleteChapter(true);
    setChapterToDelete(chapterId);
  };

  const startEditing = (chapter) => {
    setEditingChapterId(chapter.id);
    setChapterTitle(chapter.title);
  };

  const saveChanges = (chapterId, chapterSequence) => {
    handleSaveChanges(chapterId, chapterTitle, chapterSequence);
    setEditingChapterId(null);
  };

  const closeModal = () => {
    setIsDelete(false);
  };
  const closeModalChapter = () => {
    setIsDeleteChapter(false);
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    const sourceChapterId = source.droppableId;
    const destinationChapterId = destination.droppableId;

    const sourceChapter = chapters.find(
      (chap) => chap.id === Number(sourceChapterId)
    );
    const destinationChapter = chapters.find(
      (chap) => chap.id === Number(destinationChapterId)
    );

    const draggedLesson = sourceChapter.lessons.find(
      (lesson) => lesson.id === Number(draggableId)
    );
    const draggedLessonSequence = draggedLesson?.sequence;

    const destinationLesson = destinationChapter.lessons[destination.index];
    const destinationLessonSequence = destinationLesson?.sequence;

   

    const payload = {
      course_id: id,
      swapSequence: draggedLessonSequence,
      swapWithSequence: destinationLessonSequence,
      chapter_id_from: Number(sourceChapterId),
      chapter_id_to: Number(destinationChapterId),
    };
  

    try {
      await axios.patch(`${BASE_URI}/api/v1/lessons/changeSeq`, payload, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    
      toast.success("Sequence updated successfully");
      refetch();
    } catch (error) {
      // toast.error("Error updating sequence");
    }
  };

  const handleEditCourse = () => {
    setEditCourse(true);
    setCourseId(id);
    navigate("/courses/courseCreation");
  };

  const handleYouTubeClick = (lesson) => {
   
    setSelectedLesson(lesson);
  };

  async function handleSendApproval(){
   
    try {
      await axios.post(`${BASE_URI}/api/v1/expert/reviewRequest`, 
        {course_id: id}, 
        {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      toast.success("Course sent for approval successfully!");
    } catch (err) {
     
      toast.error(err?.response?.data?.message);
    }
  }

  if (isLoading) {
    return <ShimmerPostDetails card cta variant="SIMPLE" />;
  }

  return (
    <div className="w-100">
      <header className="d-flex align-items-center justify-content-between py-3 pb-4">
        <h3 className="fw-bold text-capitalize">{title || "Course Name"}</h3>
        <button
          className="signup-now py-2 px-3 fw-lightBold mb-0 h-auto"
          onClick={handleEditCourse}
        >
          Edit Course
        </button>
      </header>
      <main
        className="custom-box px-5 py-4 h-100"
        style={{
          minHeight: "30rem",
        }}
      >
        <div className="d-flex flex-column align-items-center text-center gap-5 py-4">
          <p className="fs-4 fw-lightBold">
            Start adding Chapters to your course
          </p>


          {!isAddChapter && chapters?.length === undefined && (

            <button
              className="signup-now px-4 py-1-and-08rem fs-5 mt-5"
              onClick={() => setIsAddChapter(true)}
            >
              <MdAddBox className="fs-1 me-2" />
              Add Chapter
            </button>
          )}

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="w-100">
              {chapters?.length > 0 &&
                chapters.map((chapter, index) => (
                  <Droppable
                    droppableId={String(chapter.id)}
                    key={chapter.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="rounded-2 border border-secondary-subtle text-start px-5 py-3 mb-3 "
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {editingChapterId === chapter.id ? (
                          <div className="d-flex flex-column gap-2">
                            <input
                              type="text"
                              className="px-5 py-2-half-5 border-secondary-subtle border rounded-2 w-100 input-custom text-capitalize mb-3"
                              value={chapterTitle}
                              ref={inputRef}
                              onChange={(e) => setChapterTitle(e.target.value)}
                            />
                            <div className="d-flex justify-content-end gap-3 mb-3">
                              <button
                                className="signup-now py-2 px-3 fw-light mb-0 h-auto"
                                // style={{ background: "transparent" }}
                                onClick={() => setEditingChapterId(null)}
                              >
                                Cancel
                              </button>
                              <button
                                className="signup-now py-2 px-3 fw-light mb-0 h-auto"
                                onClick={() =>
                                  saveChanges(chapter.id, chapter.sequence)
                                }
                              >
                                {isLoadingAddChapter ? (
                                  <PulseLoader size={8} color="white" />
                                ) : (
                                  "Save Changes"
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="align-items-center justify-content-between addlesson-content">
                            <div className=" addlesson-content align-items-center gap-4 ">
                              <p className="mb-0 fs-4 fw-lightBold">
                                {index + 1}. {chapter.title}
                              </p>
                              <FaPen
                                className="primary-color cursor-pointer"
                                onClick={() => startEditing(chapter)}
                              />
                              <IoMdTrash
                                className="fs-5 primary-color cursor-pointer"
                                onClick={() =>
                                  handleModalDeleteChapter(chapter.id)
                                }
                              />
                            </div>
                            <button
                              className="signup-now py-2 px-3 fw-lightBold mb-0 h-auto addlesson-button"
                              onClick={() => handleAddLessonClick(chapter.id)}
                            >
                              Add Lesson
                            </button>
                          </div>
                        )}

                        {chapter.lessons.map((lesson) => (
                          <Draggable
                            key={lesson.id}
                            draggableId={String(lesson.id)}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-3 rounded-2 border border-secondary-subtle my-3"
                                onClick={() =>
                                  handleAddLessonClick(chapter.id, lesson)
                                }
                              >
                                <div className="d-flex align-items-center justify-content-between addlesson-content">
                                  <div className="d-flex align-items-center gap-3">
                                    <FaYoutube
                                      className="primary-color fs-5 cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleYouTubeClick(lesson);
                                      }}
                                    />
                                    <p className="primary-color mb-0 text-capitalize">
                                      {index + 1}. {lesson.title}
                                    </p>
                                  </div>
                                  <div className="d-flex gap-5">
                                    <p className="mb-0 fs-5">
                                      {formatTime(lesson.duration)}
                                    </p>
                                    <TbDragDrop className="fs-3" />
                                  </div>
                                </div>
                                {selectedLesson &&
                                  selectedLesson.id === lesson.id && (
                                    <VideoPlayer
                                      videoUrl={selectedLesson.video_url}
                                      videoType={selectedLesson.video_type}
                                    />
                                  )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {openForm === chapter.id && (
                          <form onSubmit={handleLessonSubmit}>
                            <div className="mb-3">
                              <label
                                htmlFor="title"
                                className="d-block mb-1 fs-5 fw-light text-start"
                              >
                                Lesson Title{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                name="title"
                                placeholder="Enter Title"
                                className="px-5 py-2-half-5 border-secondary-subtle border rounded-2 w-100 input-custom"
                                value={newLesson.title}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between ">
                                <label
                                  htmlFor="text_content"
                                  className="d-block mb-1 fs-5 fw-light"
                                >
                                  Lesson Description{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="cursor-pointer">
                                  <input
                                    type="file"
                                    accept=".txt"
                                    onChange={handleFileUpload}
                                    style={{ display: "none" }}
                                    id="uploadFile"
                                  />
                                  <label
                                    htmlFor="uploadFile"
                                    className="fs-small neutral-color"
                                  >
                                    <RiGalleryUploadFill className="fs-5 me-2" />
                                    Upload .txt file
                                  </label>
                                </div>
                              </div>
                              <div className="border border-secondary-subtle rounded">
                                <ReactQuill
                                  value={newLesson.text_content}
                                  onChange={handleEditorChange}
                                  ref={editorRef}
                                  theme="snow"
                                  modules={{
                                    toolbar: [
                                      [
                                        { header: "1" },
                                        { header: "2" },
                                        { font: [] },
                                      ],
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
                                  placeholder="Write lesson description here..."
                                />
                              </div>
                            </div>
                            <div className="mb-3">
                              <label
                                htmlFor="video_type"
                                className="d-block mb-1 fs-5 fw-light text-start"
                              >
                                URL Type <span className="text-danger">*</span>
                              </label>
                              <select
                                name="video_type"
                                className="py-2-half-5 border-secondary-subtle border rounded-2 w-100 text-center"
                                value={newLesson.video_type}
                                onChange={handleChange}
                              >
                                <option value="" disabled>
                                  Select
                                </option>
                                <option
                                  value="youtube"
                                  className="border-top border-bottom py-2"
                                >
                                  YouTube
                                </option>
                                <option
                                  value="vimeo"
                                  className="border-bottom py-2"
                                >
                                  Vimeo
                                </option>
                                <option
                                  value="local"
                                  className="border-bottom py-2"
                                >
                                  Upload from device
                                </option>
                              </select>
                              {newLesson.video_type === "local" && (
                                <div className="mt-3 w-25">
                                  <div
                                    {...getRootProps()}
                                    className="d-flex flex-column align-items-center justify-content-center border-dotted rounded-2 py-3"
                                  >
                                    <input
                                      {...getInputProps()}
                                      // onChange={handleVideoUpload}
                                    />
                                    <IoCloudUploadOutline className="fs-1" />
                                    <p className="mt-2">Drag or drop here</p>
                                  </div>
                                  {filePreview && (
                                    <div className="mt-3">
                                      <video
                                        src={filePreview}
                                        alt="Preview"
                                        className="w-100 h-100"
                                        style={{
                                          objectFit: "cover",
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="mb-3">
                              <label
                                htmlFor="video_url"
                                className="d-block mb-1 fs-5 fw-light text-start"
                              >
                                Lesson URL{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                name="video_url"
                                placeholder="Enter or Paste URL"
                                className="px-5 py-2-half-5 border-secondary-subtle border rounded-2 w-100 input-custom"
                                value={newLesson.video_url}
                                onChange={handleChange}
                                readOnly={newLesson.video_type === "local"}
                              />
                            </div>
                            <div className="mb-3">
                              <label
                                htmlFor="thumbnail"
                                className="d-block mb-1 fs-5 fw-light"
                              >
                                Add Thumbnail{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <div {...getRootProps()} className="input-group">
                                <input
                                  type="text"
                                  name="thumbnail"
                                  placeholder={
                                    newLesson.thumbnail
                                      ? newLesson.thumbnail.name
                                      : "Select or Drag & Drop"
                                  }
                                  className="form-control px-5 py-2-half-5 border-secondary-subtle border border-end-0 rounded-start-2 input-custom"
                                  readOnly
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
                              </div>
                            </div>
                            <div className="mb-4">
                              <label
                                htmlFor="duration"
                                className="d-block mb-1 fs-5 fw-light text-start"
                              >
                                Lesson Duration <small>(minutes)</small>
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                name="duration"
                                placeholder="Enter Duration"
                                className="px-5 py-2-half-5 border-secondary-subtle border rounded-2 w-100 input-custom"
                                value={newLesson.duration}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="d-flex align-items-center justify-content-end ">
                              {editLesson ? (
                                <div className="d-flex align-items-center gap-5">
                                  <button
                                    type="button"
                                    className="signup-now py-2 px-4 mt-4"
                                    style={{ background: "#CC3737" }}
                                    onClick={() => setIsDelete(true)}
                                  >
                                    {isLoadingDeleteLesson ? (
                                      <PulseLoader size={8} color="white" />
                                    ) : (
                                      "Delete"
                                    )}
                                  </button>
                                  <button
                                    type="submit"
                                    className="signup-now py-2 px-4 mt-4"
                                  >
                                    {isLoadingAddLesson ? (
                                      <PulseLoader size={8} color="white" />
                                    ) : (
                                      "Save Changes"
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center gap-5">
                                  <button
                                    type="button"
                                    className="signup-now py-2 px-3 fw-light mb-0 h-auto"
                                    onClick={() => handleAddLessonClick(null)}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="signup-now py-2 px-3 fw-light mb-0 h-auto"
                                  >
                                    {isLoadingAddLesson ? (
                                      <PulseLoader size={8} color="white" />
                                    ) : (
                                      "Add Lesson"
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </Droppable>
                ))}
            </div>
          </DragDropContext>

          {isAddChapter && (
            <div className="w-100">
              <div className="mb-4 w-100">
                <label
                  htmlFor=""
                  className="d-block mb-1 fs-5 fw-light text-start"
                >
                  Chapter Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Chapter Title"
                  value={newChapterData.title}
                  className="px-5 py-2-half-5 border-secondary-subtle border rounded-2 w-100 input-custom"
                  onChange={(e) =>
                    setNewChapterData((prevData) => ({
                      ...prevData,
                      title: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="d-flex justify-content-end align-items-center gap-5 w-100">
                <button
                  className=" signup-now py-2 px-3 fw-lightBold mb-0 h-auto"
                  onClick={() => setIsAddChapter(false)}
                >
                  Cancel
                </button>
                <button
                  className=" signup-now py-2 px-3 fw-lightBold mb-0 h-auto"
                  onClick={handleAddChapter}
                >
                  {isLoadingAddChapter ? (
                    <PulseLoader size={8} color="white" />
                  ) : (
                    "Add Chapter"
                  )}
                </button>
              </div>
            </div>
          )}

          {chapters?.length > 0 && (
            <div className="w-100 text-start flex justify-content-between addlesson-content">
              <button
                className="signup-now py-2 px-3 fw-lightBold mb-0 h-auto"
                onClick={() => setIsAddChapter(true)}
              >
                Add Chapter
              </button>
              <button onClick={handleSendApproval} style={{border:"none", borderRadius:"0.5rem",backgroundColor:"white", boxShadow: "2px 0px 10px 2px #00000040"}} className="py-2 px-3 fw-lightBold mb-0 h-auto">
                Send Approval Request
              </button>
            </div>
          )}
        </div>
      </main>

      <Modal onClose={closeModal} show={isDelete}>
        <div className="p-3 text-center">
          <h5 className="mb-4">Are you sure to delete the lesson?</h5>
          <div className="d-flex align-items-center justify-content-center gap-5">
            <button
              className="signup-now py-2 px-3 fw-light mb-0 h-auto"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="signup-now py-2 px-3 fw-light mb-0 h-auto"
              onClick={handleDeleteLesson}
            >
              Continue
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
            onClick={() => setFinalDelete(false)}
          >
            Continue
          </button>
        </div>
      </Modal>

      <Modal onClose={closeModalChapter} show={isDeleteChapter}>
        <div className="p-3 text-center">
          <h5 className="mb-4">Are you sure to delete the chapter?</h5>
          <div className="d-flex align-items-center justify-content-center gap-5">
            <button
              className="signup-now py-2 px-3 fw-light mb-0 h-auto"
              onClick={closeModalChapter}
            >
              Cancel
            </button>
            <button
              className="signup-now py-2 px-3 fw-light mb-0 h-auto"
              onClick={handleDeleteChapter}
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>

      <Modal show={finalDeleteChapter}>
        <div className="d-flex flex-column align-items-center gap-3 justify-content-center">
          <MdDone className="fs-1" />
          <h5>Chapter deleted successfully.</h5>
          <button
            className="signup-now px-3 fw-lightBold mb-0 h-auto py-2"
            onClick={() => setFinalDeleteChapter(false)}
          >
            Continue
          </button>
        </div>
      </Modal>
    </div>
  );
}
