import React, { useState, useRef, useEffect } from 'react';
import { BsYoutube } from 'react-icons/bs';
import { CgYoutube } from 'react-icons/cg';
import { CiYoutube } from 'react-icons/ci';
import { FaYoutube } from 'react-icons/fa';

const CourseDropdown = ({
  course, // { title, options: [ { name, duration } ] }
  placeholder = "Select an option",
  onSelect = () => {},
  icon = null, // optional custom icon component
  style = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [contentHeight, setContentHeight] = useState(0);

  const dropdownRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // When options change or when dropdown is open, measure the content height.
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, course.options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Updated: Do not close dropdown on option click.
  const handleOptionClick = (option) => {
    setSelected(option);
    onSelect({ courseTitle: course.title, ...option });
  };

  // Default icon (YouTube) if no custom icon is provided
  const defaultIcon = (
    <FaYoutube className='app-text-red me-2 align-self-center'/>
  );
  const activeIcon = icon || defaultIcon;

  // Chevron icons for open/close state
  const chevronDown = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
      />
    </svg>
  );
  const chevronUp = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M1.646 11.354a.5.5 0 0 0 .708 0L8 5.707l5.646 5.647a.5.5 0 0 0 .708-.708l-6-6a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 0 .708z"
      />
    </svg>
  );

  // Options container style: using measured maxHeight for a smooth transition.
  const optionsContainerStyle = {
    overflow: 'hidden',
    maxHeight: isOpen ? `${contentHeight}px` : '0px',
    transition: 'max-height 0.3s ease-in-out',
    border: isOpen ? '1px solid #ddd' : 'none',
    borderTop: 'none',
    marginTop: isOpen ? '5px' : '0',
    borderRadius:"5px"
  };

  return (
    <div ref={dropdownRef} className="" style={{ ...style }}>
      {/* Dropdown Header */}
      <div
        className="border rounded p-2 d-flex justify-content-between align-items-center"
        onClick={toggleDropdown}
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          backgroundColor: '#fff',
        }}
      >
        <div className="d-flex align-items-center">
          {activeIcon}
          <span>{course.title}</span>
        </div>
        {isOpen ? chevronUp : chevronDown}
      </div>

      {/* Options Container */}
      <div style={optionsContainerStyle}>
        <div ref={contentRef}>
          {course.options.map((option, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between p-2"
              onClick={() => handleOptionClick(option)}
              style={{
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                backgroundColor:
                  selected?.name === option.name ? '#f8f9fa' : 'transparent',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#f8f9fa')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  selected?.name === option.name ? '#f8f9fa' : 'transparent')
              }
            >
              <div className="d-flex align-items-center">
                {activeIcon}
                <span>{option.name}</span>
              </div>
              {option.duration && <span>{option.duration}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDropdown;
