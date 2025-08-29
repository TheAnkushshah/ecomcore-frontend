"use client"

import React, { useEffect, useRef, useState } from "react"
import { MoveLeft, MoveRight, Volume2, VolumeX, Play, Pause } from "lucide-react"

const mediaList = [
  { type: "image", src: "/hero1.jpg", mobileSrc: "/hero1-mobile.png"},
  { type: "image", src: "/hero2.jpeg", mobileSrc: "/hero2-mobile.png" },
  { type: "image", src: "/hero3.jpg", mobileSrc: "/hero3-mobile.png" },
  { type: "image", src: "/hero4.jpeg", mobileSrc: "/hero4-mobile.png" },
  { type: "video", src: "/hero5.mp4" },
]

// Per-slide text content
const heroTexts = [
  {
    category: "Denim",
    title: "Straight Fit Jeans",
    link: { label: "Shop Jeans", url: "/category/jeans" },
  },
  {
    category: "T-Shirts",
    title: "Oversized T-Shirts",
    link: { label: "Explore T-Shirts", url: "/category/tshirts" },
  },
  {
    category: "Footwear",
    title: "Sneakers Collection",
    link: { label: "See Sneakers", url: "/category/sneakers" },
  },
  {
    category: "Dresses",
    title: "Summer Dresses",
    link: { label: "Browse Dresses", url: "/category/dresses" },
  },
  {
    category: "Video",
    title: "Discover More",
    link: { label: "Watch Now", url: "/video" },
  },
]

const Hero = () => {
  const [current, setCurrent] = useState(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % mediaList.length)
    }, 60000) // 60 seconds per slide (was 30 seconds)
    return () => clearInterval(interval)
  }, [])

  // Reset play/mute state when slide changes
  useEffect(() => {
    // Pause video when slide changes away from video
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setIsPlaying(mediaList[current].type === "video")
    setIsMuted(true)
  }, [current])

  // Remove isPlaying/isMuted from the dependency array of the next effect
  useEffect(() => {
    if (mediaList[current].type === "video" && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
      videoRef.current.muted = isMuted
    }
  }, [isPlaying, isMuted])

  const handlePlayPause = () => {
    if (mediaList[current].type === "video" && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  const handleMuteUnmute = () => {
    if (mediaList[current].type === "video" && videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted((prev) => !prev)
    }
  }

  const { category, title, link } = heroTexts[current]

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="w-full border-b border-ui-border-base relative bg-ui-bg-subtle overflow-hidden hero-dynamic-height small:hero-dynamic-height">
      {/* Background media carousel */}
      <div className="absolute inset-0 z-0 transition-all duration-700">
        {mediaList.map((media, idx) => (
          <React.Fragment key={idx}>
            {media.type === "image" ? (
              <img
                src={isMobile && media.mobileSrc ? media.mobileSrc : media.src}
                alt=""
                className={`object-cover object-top w-full h-full absolute inset-0 transition-opacity duration-700 ${
                  current === idx ? "opacity-100" : "opacity-0"
                }`}
                draggable={false}
              />
            ) : (
              <video
                ref={current === idx ? videoRef : undefined}
                src={media.src}
                autoPlay
                loop
                playsInline
                muted={isMuted}
                className={`object-cover object-bottom w-full h-full absolute inset-0 transition-opacity duration-700 ${
                  current === idx ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
          </React.Fragment>
        ))}
        {/* Black gradient overlay from bottom */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        {/* Slide-specific text above arrows, now positioned at the bottom just above arrows */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <span className="text-xs text-white/80 tracking-widest uppercase">
            {category}
          </span>
          <span className="text-3xl md:text-4xl font-bold text-white">
            {title}
          </span>
          <a
            href={link.url}
            className="text-xs text-white underline underline-offset-4 decoration-[1px] transition-all duration-300 hover:no-underline hover:decoration-transparent after:content-[''] after:block after:w-full after:h-[1px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
            style={{ position: "relative" }}
          >
            {link.label}
          </a>
        </div>
        {/* Slide controls */}
        <div className="absolute bottom-16 left-1/2 z-20 flex gap-8 -translate-x-1/2">
          <button
            aria-label="Previous slide"
            onClick={() =>
              setCurrent((prev) => (prev - 1 + mediaList.length) % mediaList.length)
            }
          >
            <MoveLeft size={20} color="white" strokeWidth={1.5} />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => setCurrent((prev) => (prev + 1) % mediaList.length)}
          >
            <MoveRight size={20} color="white" strokeWidth={1.5} />
          </button>
        </div>
        {/* Play/Pause icon (bottom left, below arrows) */}
        {mediaList[current].type === "video" && (
          <button
            aria-label={isPlaying ? "Pause video" : "Play video"}
            onClick={handlePlayPause}
            className="absolute left-4 bottom-4 z-30 small:left-[12.8%] small:bottom-8"
            type="button"
          >
            {isPlaying ? (
              <Pause size={22} color="white" strokeWidth={1} />
            ) : (
              <Play size={22} color="white" strokeWidth={1} />
            )}
          </button>
        )}
        {/* Volume icon (bottom right, below arrows) */}
        {mediaList[current].type === "video" && (
          <button
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            onClick={handleMuteUnmute}
            className="absolute right-4 bottom-4 z-30 small:right-[14%] small:bottom-8"
            type="button"
          >
            {isMuted ? (
              <VolumeX size={22} color="white" strokeWidth={1} />
            ) : (
              <Volume2 size={22} color="white" strokeWidth={1} />
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default Hero