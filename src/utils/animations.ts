import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Fade in up animation
export const fadeInUp = (element: HTMLElement | null, delay = 0) => {
    if (!element) return

    gsap.fromTo(
        element,
        {
            opacity: 0,
            y: 40,
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay,
            ease: 'power3.out',
        }
    )
}

// Stagger fade in for lists
export const staggerFadeIn = (elements: HTMLElement[] | NodeListOf<Element>, staggerDelay = 0.1) => {
    gsap.fromTo(
        elements,
        {
            opacity: 0,
            y: 30,
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: staggerDelay,
            ease: 'power2.out',
        }
    )
}

// Button hover animation
export const buttonHover = (element: HTMLElement) => {
    gsap.to(element, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
    })
}

export const buttonHoverOut = (element: HTMLElement) => {
    gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
    })
}

// Card lift effect
export const cardLift = (element: HTMLElement) => {
    gsap.to(element, {
        y: -8,
        duration: 0.3,
        ease: 'power2.out',
    })
}

export const cardLiftOut = (element: HTMLElement) => {
    gsap.to(element, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
    })
}

// Rotate animation
export const rotate = (element: HTMLElement, degrees = 360) => {
    gsap.to(element, {
        rotation: degrees,
        duration: 0.6,
        ease: 'power2.inOut',
    })
}

// Scale pulse animation
export const pulse = (element: HTMLElement) => {
    gsap.to(element, {
        scale: 1.1,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
    })
}
