import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TempleDataService } from '../../services/temple.service';
import { CountryTimezoneService } from '../../services/country-timezone.service';
import { TempleService, PanchangDay } from '../../models/temple.models';

interface HeroSlide {
  image: string;
  sanskritMotto: string;
  title: string;
  subtitle: string;
  highlightBadge: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly templeService = inject(TempleDataService);
  readonly countryTzService = inject(CountryTimezoneService);

  readonly liveStatus = this.templeService.liveStatus;
  readonly services = this.templeService.services;
  readonly selectedCountry = this.countryTzService.selectedCountry;

  // Hero Slides
  readonly slides: HeroSlide[] = [
    {
      image: 'assets/images/hero-temple.jpg',
      sanskritMotto: '॥ आत्मनः प्रशान्तौ सर्वस्य शान्तिः ॥',
      title: 'Welcome to Sakoon Temple',
      subtitle: 'A Sacred Haven of Divine Peace, Authentic Vedic Rituals & Spiritual Solace',
      highlightBadge: 'Spiritual Sanctuary',
      primaryCtaText: 'Book Puja / Darshan',
      primaryCtaLink: '/booking',
      secondaryCtaText: 'Explore Panchang',
      secondaryCtaLink: '/calendar'
    },
    {
      image: 'assets/images/havan.jpg',
      sanskritMotto: '॥ ॐ पावका नः सरस्वती वाजेभिर्वाजिनीवती ॥',
      title: 'Sacred Vedic Havan & Yagya',
      subtitle: 'Maha Mrityunjaya, Gayatri & Navagraha fire ceremonies by learned Vedic priests for purification and health.',
      highlightBadge: 'Divine Fire Rites',
      primaryCtaText: 'Explore Havan Vidhi',
      primaryCtaLink: '/services/vedic-havan-yagya',
      secondaryCtaText: 'Schedule Ceremony',
      secondaryCtaLink: '/booking'
    },
    {
      image: 'assets/images/kundali.jpg',
      sanskritMotto: '॥ ज्योतिषामपि तज्ज्योतिस्तमसः परमुच्यते ॥',
      title: 'Kundali & Jyotish Paramarsh',
      subtitle: 'Accurate Janampatri horoscope reading, planetary dosha remedies, and career-marriage guidance.',
      highlightBadge: 'Vedanga Jyotisha',
      primaryCtaText: 'Kundali Guidance',
      primaryCtaLink: '/services/kundali-jyotish',
      secondaryCtaText: 'Book Jyotish Slot',
      secondaryCtaLink: '/booking'
    },
    {
      image: 'assets/images/tarot.jpg',
      sanskritMotto: '॥ ब्रह्माण्डं चेतसा युक्ता ॥',
      title: 'Tarot Card Predictions',
      subtitle: 'Intuitive cosmic symbology and meditative spiritual readings for clarity, decisions, and inner balance.',
      highlightBadge: 'Intuitive Divination',
      primaryCtaText: 'Tarot Readings',
      primaryCtaLink: '/services/tarot-prediction',
      secondaryCtaText: 'Book 1-on-1 Session',
      secondaryCtaLink: '/booking'
    },
    {
      image: 'assets/images/sanctum.jpg',
      sanskritMotto: '॥ मन्दिरं शान्तिनिलयं पावनं मोक्षसाधनम् ॥',
      title: 'Inner Sanctum Darshan',
      subtitle: 'Immerse your soul in meditative stillness, fragrant temple dhoop, brass bells resonance, and sacred aartis.',
      highlightBadge: 'Tranquil Darshan',
      primaryCtaText: 'View Aarti Schedule',
      primaryCtaLink: '/timings',
      secondaryCtaText: 'About Temple',
      secondaryCtaLink: '/about'
    }
  ];

  readonly currentSlideIndex = signal(0);
  private slideInterval: any;

  // Today's Panchang Highlight
  readonly todayPanchang = signal<PanchangDay | null>(null);

  ngOnInit(): void {
    this.startSlideTimer();
    this.loadTodayPanchang();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  private startSlideTimer(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide(false);
    }, 5500);
  }

  private resetSlideTimer(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.startSlideTimer();
  }

  nextSlide(manual: boolean = true): void {
    this.currentSlideIndex.update(idx => (idx + 1) % this.slides.length);
    if (manual) {
      this.resetSlideTimer();
    }
  }

  prevSlide(): void {
    this.currentSlideIndex.update(idx => (idx - 1 + this.slides.length) % this.slides.length);
    this.resetSlideTimer();
  }

  setSlide(index: number): void {
    this.currentSlideIndex.set(index);
    this.resetSlideTimer();
  }

  private loadTodayPanchang(): void {
    const cDate = this.countryTzService.getCountryCurrentDate();
    const days = this.templeService.generatePanchangMonth(cDate.year, cDate.month);
    const matched = days.find(d => d.isToday);
    if (matched) {
      this.todayPanchang.set(matched);
    }
  }
}
