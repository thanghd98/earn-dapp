export function Loading() {
  return (
    <div className="spinner text-white" style={{ width: '30px', height: '30px' }}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            className="spinner-icon text-white"
            style={{ width: '30px', height: '30px' }}
        >
            <circle
                cx="25"
                cy="25"
                r="20"
                strokeWidth="5"
                stroke="#fff"
                fill="none"
                strokeDasharray="125.6"
                strokeDashoffset="0"
            >
                <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-125.6"
                    dur="1s"
                    repeatCount="indefinite"
                />
            </circle>
        </svg>
    </div>
  )
}
