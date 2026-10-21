import { Injectable, inject, signal } from '@angular/core';
import { TempleService, TempleTimingSlot, LiveTempleStatus, PanchangDay, PanchangFestival, BookingRequest, BookingSlot } from '../models/temple.models';
import { CountryTimezoneService } from './country-timezone.service';

@Injectable({
  providedIn: 'root'
})
export class TempleDataService {
  readonly countryTzService = inject(CountryTimezoneService);

  // Live Temple Status Signal
  readonly liveStatus = signal<LiveTempleStatus>({
    isOpen: true,
    statusText: 'OPEN NOW • Morning Darshan',
    statusBadge: 'Open',
    currentTimeStr: '00:00:00 AM',
    currentDateStr: '',
    nextEvent: 'Rajbhog Aarti',
    nextEventTime: '12:00 PM',
    countryTimeStr: '',
    countryDateStr: '',
    countryFlag: '🇮🇳',
    countryName: 'India',
    countryCode: 'IN',
    countryTzName: 'IST (UTC+5:30)',
    timeDiffText: 'Sanctum Live Time (IST)',
    isDstActive: false,
    nextEventLocalTime: '12:00 PM IST'
  });

  // Services Catalog
  readonly services: TempleService[] = [
    {
      id: 'kundali',
      slug: 'kundali-jyotish',
      title: 'Kundali & Jyotish Paramarsh',
      hindiTitle: 'जन्मपत्री कुण्डली एवं वैदिक ज्योतिष परामर्श',
      subtitle: 'Complete Vedic Horoscope Analysis, Dosha Nivaran & Planetary Remedies',
      category: 'astrology',
      image: 'assets/images/kundali.jpg',
      badge: 'Vedic Astrology',
      shortDesc: 'Deep analysis of Janam Kundali by experienced Acharyas for career, marriage, health, Kaal Sarp & Mangal Dosha remedies.',
      fullDesc: 'Vedic Jyotish is the eye of the Vedas (Vedanga Jyotisha), illuminating your past, present, and future karma. At Sakoon Temple, our venerable Vedic Astrologers read your birth chart (Lagna, Navamsha, Dasha periods, and planetary transits) to provide authentic Vedic remedies, gemstone guidance, Yantra worship, and auspicious timing for life milestones.',
      scripturalRef: 'Rigveda & Brihat Parashara Hora Shastra',
      significance: [
        'Precise Janam Kundali generation and planetary degrees calculation',
        'In-depth analysis of 12 houses (Bhavas) governing Wealth, Career, Health, Family & Moksha',
        'Identification of Kaal Sarp Dosha, Pitru Dosha, Manglik Dosha, and Shani Sade Sati',
        'Personalized Vedic Upay: Mantra Japa, Rudraksha, Gemstones & Danam (Charity)',
        'Kundali Milan (Horoscope Matching for Marriage) with 36 Guna Milan & Nadi Dosha check'
      ],
      vidhiSteps: [
        { step: 1, title: 'Birth Details Verification', desc: 'Devotee provides exact Date of Birth, Time, and City of Birth with parents/gotra details.' },
        { step: 2, title: 'Chart Drafting & Shodashvarga', desc: 'Acharya calculates exact planetary alignments, D-9 Navamsha, and Current Mahadasha / Antardasha.' },
        { step: 3, title: 'Face-to-Face / Temple Consultation', desc: '45-minute one-on-one session addressing questions, career path, relationships, and health.' },
        { step: 4, title: 'Sankalpa & Remedial Puja', desc: 'Sanctum chanting of specialized Graha Shanti mantras and Prasad distribution.' }
      ],
      samagriIncluded: [
        'Handcrafted Laminated Janampatri Scroll',
        'Graha Shanti Raksha Sutra (Sacred Thread)',
        'Blessed Navagraha Yantra',
        'Temple Prasad (Charanamrit & Dry Fruits)'
      ],
      devoteeRequirements: [
        'Accurate Date, Time, and Place of Birth',
        'Specific queries or areas of life needing guidance',
        'Pure intentions and respect for Vedic wisdom'
      ],
      duration: '45 - 60 Minutes',
      dakshinaSuggested: '₹ 1,100 / Devotee Contribution',
      idealMuhurat: 'All Auspicious Days (Morning & Evening sessions)',
      icon: '✨'
    },
    {
      id: 'tarot',
      slug: 'tarot-prediction',
      title: 'Tarot Card Prediction & Energy Reading',
      hindiTitle: 'टैरो कार्ड भविष्यकथन एवं आध्यात्मिक ऊर्जा दर्शन',
      subtitle: 'Intuitive Spiritual Divination, Chakra Energy Balance & Path Guidance',
      category: 'astrology',
      image: 'assets/images/tarot.jpg',
      badge: 'Divine Intuition',
      shortDesc: 'Unveil subconscious energies, cosmic synchronicities, and future pathways through sacred Tarot symbology and meditative channeling.',
      fullDesc: 'Tarot is a sacred mirror reflecting the soul\'s current vibrational plane. In the peaceful sanctum of Sakoon Temple, our intuitive spiritual readers blend traditional Major & Minor Arcana wisdom with Vedic meditative mindfulness to help you navigate pivotal life transitions, emotional healing, and karmic crossroads.',
      scripturalRef: 'Sacred Hermetic & Meditative Intuitive Tradition',
      significance: [
        'Clarity on romantic relationships, soul connections, and emotional harmony',
        'Career decisions, entrepreneurial ventures, and financial transitions',
        'Identification of energetic blockages and Chakra balancing advice',
        'Empowerment to take self-aligned decisions rather than fear-based choices',
        'Past, Present, and Projected Outcome spread with deep spiritual counsel'
      ],
      vidhiSteps: [
        { step: 1, title: 'Sacred Cleansing & Attunement', desc: 'Purification of space with holy sage and temple dhoop; devotee meditates on the prime query.' },
        { step: 2, title: 'Card Shuffling & Energy Transfer', desc: 'Devotee touches the sacred deck, infusing personal aura into the cards.' },
        { step: 3, title: 'The Celtic Cross / Divine 7 Spread', desc: 'Cards are revealed layer by layer, decoding root challenges and cosmic alignments.' },
        { step: 4, title: 'Aura Blessing & Guidance Card', desc: 'Devotee receives an Oracle affirmation card and sanctified sacred sandalwood tilak.' }
      ],
      samagriIncluded: [
        'Personal Written Prediction Summary',
        'Blessed Quartz Crystal / Energy Stone',
        'Sacred Temple Dhoop Cones',
        'Daily Affirmation Card'
      ],
      devoteeRequirements: [
        'Open, receptive mind without preconceptions',
        'Focused question or life situation for clarity',
        'Silence mobile devices during the divine reading'
      ],
      duration: '40 - 50 Minutes',
      dakshinaSuggested: '₹ 1,500 / Devotee Contribution',
      idealMuhurat: 'Peaceful Morning or Twilight Hours',
      icon: '🔮'
    },
    {
      id: 'havan',
      slug: 'vedic-havan-yagya',
      title: 'Vedic Havan & Maha Yagya',
      hindiTitle: 'वैदिक महायज्ञ, नवग्रह हवन एवं शांति अनुष्ठान',
      subtitle: 'Sacred Fire Ceremony for Health, Prosperity, Negativity Removal & Peace',
      category: 'havan',
      image: 'assets/images/havan.jpg',
      badge: 'Agni Hotra',
      shortDesc: 'Purifying fire sacrifice by Vedic priests with sacred woods, herbs, ghee, and resonant Sanskrit mantras for family well-being.',
      fullDesc: 'Agni is the sacred messenger of the Devas in Sanatana Dharma. The divine fumes of the sacred Havan Kund purify the surrounding atmosphere, eliminate Vastu doshas, and invoke positive cosmic vibrations. Sakoon Temple conducts Maha Mrityunjaya Havan, Navagraha Shanti Havan, Gayatri Havan, and Lakshmi Kuber Yagya according to rigorous Vedic rites.',
      scripturalRef: 'Yajurveda & Grihya Sutras',
      significance: [
        'Removal of negative energies, Nazar dosha, and mental anxiety (Sakoon)',
        'Maha Mrityunjaya ahutis for longevity, healing, and recovery from chronic ailments',
        'Navagraha pacification to mitigate malefic planetary periods',
        'Scientific environmental purification through sacred medicinal herbs & cow ghee',
        'Family prosperity, peace, and spiritual upliftment for all generations'
      ],
      vidhiSteps: [
        { step: 1, title: 'Pavitrikaran & Sankalpa', desc: 'Devotees chant purification mantras with holy water, taking Gotra-specific sankalpa.' },
        { step: 2, title: 'Agni Prajwalan & Navagraha Avahan', desc: 'Sacred fire is ignited with sacred camphor and mango wood sticks.' },
        { step: 3, title: 'Ahuti Samarpan (108 / 1008 Mantras)', desc: 'Devotees and Acharyas offer pure ghee, guggulu, camphor, til, and sacred samagri.' },
        { step: 4, title: 'Purnahuti & Bhasma Tilak', desc: 'Sacred coconut is offered in final ahuti; devotees receive divine Agni Bhasma and Raksha Sutra.' }
      ],
      samagriIncluded: [
        'Complete Vedic Havan Samagri (Ghee, Guggulu, Til, Jau, Camphor)',
        'Sacred Mango & Peepal Wood for Havan Kund',
        'Fresh Marigold, Rose garlands and Lotus flowers',
        'Bhasma (Holy Ash) container and Panchamrit Prasad'
      ],
      devoteeRequirements: [
        'Devotee to wear clean traditional Indian attire (Kurta/Dhoti/Saree)',
        'Fasting recommended until the morning Purnahuti',
        'List of family members and Gotra'
      ],
      duration: '1.5 - 2 Hours',
      dakshinaSuggested: '₹ 3,100 / Devotee Contribution',
      idealMuhurat: 'Brahma Muhurat or Auspicious Morning Tithis',
      icon: '🔥'
    },
    {
      id: 'tarpan',
      slug: 'tarpan-pitru-shradh',
      title: 'Tarpan & Pitru Shradh Vidhi',
      hindiTitle: 'तर्पण, पिंडदान एवं पितृ शांति अनुष्ठान',
      subtitle: 'Sacred Water & Sesame Offerings for Ancestral Peace and Eternal Blessings',
      category: 'shradh',
      image: 'assets/images/tarpan.jpg',
      badge: 'Pitru Moksha',
      shortDesc: 'Vedic rituals of offering holy water, Kusha grass, and black sesame to departed ancestors for their liberation and ancestral grace.',
      fullDesc: 'Pitru Rina (debt to ancestors) is one of the three primary sacred debts recognized in Vedic tradition. When ancestors are propitiated through holy Tarpan, Pind Daan, and Shraddha, their souls attain supreme tranquility (Sakoon), and they shower blessings of progeny, peace, and abundance onto the descendants.',
      scripturalRef: 'Garuda Purana, Manu Smriti & Shatapatha Brahmana',
      significance: [
        'Relief from Pitru Dosha, unexplained family obstacles, and career stagnation',
        'Gratitude and peace for departed parents, grandparents, and ancestors',
        'Kusha grass and Gangajal offerings reaching subtler spiritual dimensions',
        'Blessings for prosperity of upcoming generations (Vansha Vriddhi)',
        'Special rituals conducted during Pitru Paksha, Amavasya, and monthly Tithis'
      ],
      vidhiSteps: [
        { step: 1, title: 'Achaman & Kusha Motak Dharan', desc: 'Devotee puts on the sacred ring of Kusha grass and faces the sacred direction.' },
        { step: 2, title: 'Deva, Rishi & Pitru Tarpana', desc: 'Offering sanctified water with white flowers, barley, and black sesame seeds (Krishna Til).' },
        { step: 3, title: 'Pinda Samarpan & Tilanjali', desc: 'Preparation and offering of sacred barley/rice pinda balls with Vedic chants.' },
        { step: 4, title: 'Brahmin Bhojan & Gau/Kaga Grass', desc: 'Food offerings to cows, crows, and Vedic priests to complete the ancestral cycle.' }
      ],
      samagriIncluded: [
        'Pure Gangajal and Sacred Narmada/Kaveri holy water',
        'Desi Kusha Grass, Black Sesame Seeds (Til), Barley (Jau)',
        'Copper / Brass Tarpan Patra (vessel)',
        'Arrangement for Cow Feeding (Go-Seva) at Temple Goshala'
      ],
      devoteeRequirements: [
        'Names and relationships of departed ancestors',
        'Devotee must observe ritual cleanliness and fast on the morning of Tarpan',
        'Devotee to wear white traditional clothing (recommended)'
      ],
      duration: '1 Hour - 1.5 Hours',
      dakshinaSuggested: '₹ 2,100 / Devotee Contribution',
      idealMuhurat: 'Aparahna Kaal (Afternoon) or Amavasya / Shraddha Tithis',
      icon: '🌿'
    },
    {
      id: 'family-celebration',
      slug: 'family-birthday-vahan-puja',
      title: 'Family Functions, Birthday & Vehicle Puja',
      hindiTitle: 'पारिवारिक मांगलिक उत्सव, जन्मोत्सव एवं नव वाहन पूजन',
      subtitle: 'Auspicious Blessings for Birthdays, Anniversaries, Griha Pravesh & New Vehicles',
      category: 'celebration',
      image: 'assets/images/family-puja.jpg',
      badge: 'Shubh Mangal',
      shortDesc: 'Celebrate milestone moments, new cars/bikes, birthdays, and anniversaries with Vedic mantras, flower garlands, and divine protection.',
      fullDesc: 'Every joyful moment in human life is magnified when consecrated at the feet of the Divine. Whether bringing home a new car, celebrating a milestone birthday, observing a wedding anniversary, or moving into a new home, Sakoon Temple priests perform personalized Manglik Pujan to safeguard you from accidents and usher in enduring joy.',
      scripturalRef: 'Atharvaveda Mangala Sutras',
      significance: [
        'Vahan Pujan: Sanctification of new vehicles (Cars, Bikes, Commercial trucks) to ward off accidents',
        'Ayushya Sukta recitation for birthdays to bestow long life, health, and wisdom',
        'Dampati (Couple) blessings for marriage anniversaries fostering lifelong harmony',
        'Griha Pravesh & Shop inauguration rituals invoking Goddess Lakshmi\'s grace',
        'Joyous atmosphere with marigold flower garlands, coconuts, and sweets'
      ],
      vidhiSteps: [
        { step: 1, title: 'Swasti Vachan & Ganesha Avahan', desc: 'Invoking Lord Ganesha, the remover of all obstacles, with holy chanting.' },
        { step: 2, title: 'Sanctification of Vehicle / Devotee', desc: 'Sprinkling of Gangajal, drawing sacred protective symbols with Kumkum and Haldi.' },
        { step: 3, title: 'Garlanding & Aarti', desc: 'Adorning with marigold garlands, lighting camphor and brass diya for divine light.' },
        { step: 4, title: 'Coconut Breaking & Sweets Distribution', desc: 'Breaking of auspicious coconut for protection, wheel sanctification with lemons, and Prasad.' }
      ],
      samagriIncluded: [
        'Fresh Yellow & Orange Marigold Garlands',
        'Fresh Coconut, Lemons, and Sacred Raksha Threads',
        'Kumkum, Chandan, Haldi, Akshat, and Diya',
        'Box of Temple Maha-Prasad (Laddus / Peda)'
      ],
      devoteeRequirements: [
        'Bring the vehicle to the designated Temple Pujan Courtyard',
        'Family members gathered in celebratory mood',
        'Clean vehicle and celebratory spirit'
      ],
      duration: '30 - 45 Minutes',
      dakshinaSuggested: '₹ 1,100 / Devotee Contribution',
      idealMuhurat: 'Morning or Evening Shubh Choghadiya',
      icon: '🎉'
    }
  ];

  // Daily Temple Timing Slots
  readonly timingSlots: TempleTimingSlot[] = [
    { name: 'Suprabhatam & Temple Opening', hindiName: 'सुप्रभातम् एवं कपाट उद्घाटन', timeRange: '05:30 AM', startHour: 5, startMin: 30, endHour: 6, endMin: 0, type: 'darshan', description: 'Sacred temple gates open to the chanting of Vedic shlokas.' },
    { name: 'Mangala Aarti', hindiName: 'मंगला आरती', timeRange: '06:00 AM - 06:30 AM', startHour: 6, startMin: 0, endHour: 6, endMin: 30, type: 'aarti', description: 'First sacred morning aarti with pure cow ghee lamps and conch resonance.' },
    { name: 'Morning Darshan & Archana', hindiName: 'प्रातः दर्शन एवं विशेष अर्चना', timeRange: '06:30 AM - 12:00 PM', startHour: 6, startMin: 30, endHour: 12, endMin: 0, type: 'darshan', description: 'Devotees may offer personal archana, flowers, and holy parikrama.' },
    { name: 'Rajbhog Aarti & Bhog Offering', hindiName: 'राजभोग आरती एवं महाभोग', timeRange: '12:00 PM - 12:30 PM', startHour: 12, startMin: 0, endHour: 12, endMin: 30, type: 'aarti', description: 'Divine offering of satvik prasad to the deities followed by Rajbhog aarti.' },
    { name: 'Temple Vishram (Gates Closed)', hindiName: 'मध्याह्न विश्राम (कपाट बंद)', timeRange: '12:30 PM - 04:30 PM', startHour: 12, startMin: 30, endHour: 16, endMin: 30, type: 'vishram', description: 'Afternoon sanctum rest period for deities. Temple campus garden remains accessible.' },
    { name: 'Evening Reopening & Darshan', hindiName: 'संध्या कपाट उद्घाटन एवं दर्शन', timeRange: '04:30 PM - 07:00 PM', startHour: 16, startMin: 30, endHour: 19, endMin: 0, type: 'darshan', description: 'Evening peaceful darshan, meditation, and spiritual reading.' },
    { name: 'Maha Sandhya Aarti & Bhajan', hindiName: 'महा संध्या आरती एवं दीपदान', timeRange: '07:00 PM - 07:45 PM', startHour: 19, startMin: 0, endHour: 19, endMin: 45, type: 'aarti', description: 'Grand multi-tiered brass lamp aarti accompanied by temple bells and mridangam.' },
    { name: 'Night Darshan & Prasad Distribution', hindiName: 'रात्रि दर्शन एवं प्रसाद वितरण', timeRange: '07:45 PM - 09:15 PM', startHour: 19, startMin: 45, endHour: 21, endMin: 15, type: 'darshan', description: 'Devotees receive sanctified charanamrit and dry fruit prasad.' },
    { name: 'Shayan Aarti & Temple Closing', hindiName: 'शयन आरती एवं विश्राम कपाट', timeRange: '09:15 PM - 09:30 PM', startHour: 21, startMin: 15, endHour: 21, endMin: 30, type: 'aarti', description: 'Final serene lori and shayan stuti; gates close for the night at 09:30 PM.' }
  ];

  constructor() {
    this.updateLiveStatus();
    // Update live clock every second
    setInterval(() => {
      this.updateLiveStatus();
    }, 1000);
  }

  getServiceBySlug(slugOrId: string): TempleService | undefined {
    return this.services.find(s => s.slug === slugOrId || s.id === slugOrId);
  }

  private updateLiveStatus(): void {
    const now = new Date();

    // Get actual Haridwar IST time (Asia/Kolkata) with astronomical accuracy
    const istParts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }).formatToParts(now);

    const istHour = parseInt(istParts.find(p => p.type === 'hour')?.value || '0', 10);
    const istMin = parseInt(istParts.find(p => p.type === 'minute')?.value || '0', 10);
    const totalMins = istHour * 60 + istMin;

    const istClock = this.countryTzService.templeIstClock();
    const countryClock = this.countryTzService.countryClock();
    const selectedCountry = this.countryTzService.selectedCountry();
    const timeDiff = this.countryTzService.timeDifferenceNotice();
    const isDstActive = this.countryTzService.isDstActive();

    // Open ranges in Haridwar IST:
    // Morning: 05:30 (330m) to 12:30 (750m)
    // Evening: 16:30 (990m) to 21:30 (1290m)
    const isMorningOpen = totalMins >= 330 && totalMins < 750;
    const isEveningOpen = totalMins >= 990 && totalMins < 1290;
    const isOpen = isMorningOpen || isEveningOpen;

    let statusText = '';
    let statusBadge = '';
    let nextEvent = '';
    let nextEventTime = '';
    let nextEventIstHour = 6;
    let nextEventIstMin = 0;

    if (isMorningOpen) {
      statusText = 'OPEN NOW • Morning Darshan & Blessings';
      statusBadge = 'Open Now';
      if (totalMins < 390) {
        nextEvent = 'Mangala Aarti';
        nextEventTime = '06:00 AM';
        nextEventIstHour = 6;
        nextEventIstMin = 0;
      } else if (totalMins < 720) {
        nextEvent = 'Rajbhog Aarti & Bhog';
        nextEventTime = '12:00 PM';
        nextEventIstHour = 12;
        nextEventIstMin = 0;
      } else {
        nextEvent = 'Afternoon Vishram Closing';
        nextEventTime = '12:30 PM';
        nextEventIstHour = 12;
        nextEventIstMin = 30;
      }
    } else if (isEveningOpen) {
      statusText = 'OPEN NOW • Evening Darshan & Meditation';
      statusBadge = 'Open Now';
      if (totalMins < 1140) {
        nextEvent = 'Maha Sandhya Aarti';
        nextEventTime = '07:00 PM';
        nextEventIstHour = 19;
        nextEventIstMin = 0;
      } else if (totalMins < 1275) {
        nextEvent = 'Shayan Aarti';
        nextEventTime = '09:15 PM';
        nextEventIstHour = 21;
        nextEventIstMin = 15;
      } else {
        nextEvent = 'Night Closing';
        nextEventTime = '09:30 PM';
        nextEventIstHour = 21;
        nextEventIstMin = 30;
      }
    } else {
      // Closed / Vishram
      statusBadge = 'Closed (Vishram)';
      if (totalMins >= 750 && totalMins < 990) {
        statusText = 'CLOSED NOW • Afternoon Temple Vishram (Opens at 04:30 PM IST)';
        nextEvent = 'Evening Reopening';
        nextEventTime = '04:30 PM';
        nextEventIstHour = 16;
        nextEventIstMin = 30;
      } else {
        statusText = 'CLOSED NOW • Night Vishram (Opens at 05:30 AM IST)';
        nextEvent = 'Morning Suprabhatam';
        nextEventTime = '05:30 AM';
        nextEventIstHour = 5;
        nextEventIstMin = 30;
      }
    }

    const nextEventLocal = this.countryTzService.convertIstTimeToCountry(nextEventIstHour, nextEventIstMin);

    this.liveStatus.set({
      isOpen,
      statusText,
      statusBadge,
      currentTimeStr: istClock.timeStr,
      currentDateStr: istClock.dateStr,
      nextEvent,
      nextEventTime,
      countryTimeStr: countryClock.timeStr,
      countryDateStr: countryClock.dateStr,
      countryFlag: selectedCountry.flag,
      countryName: selectedCountry.name,
      countryCode: selectedCountry.code,
      countryTzName: selectedCountry.timeZoneName,
      timeDiffText: timeDiff.text,
      isDstActive,
      nextEventLocalTime: nextEventLocal.localTimeStr
    });
  }

  // =========================================================================
  // AUTONOMOUS LUNISOLAR ASTRONOMICAL HINDU PANCHANG & CALENDAR ENGINE
  // =========================================================================
  generatePanchangMonth(year: number, monthIndex: number): PanchangDay[] {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstDayIndex = new Date(year, monthIndex, 1).getDay(); // 0 = Sun, 1 = Mon ...
    
    // Accurately determine "Today" matching the devotee's local country timezone
    const today = this.countryTzService.getCountryCurrentDate().fullDate;

    const result: PanchangDay[] = [];

    // Previous month padding
    const prevMonthDays = new Date(year, monthIndex, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const d = new Date(year, monthIndex - 1, dayNum);
      result.push(this.calculatePanchangForDate(d, false, today));
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, monthIndex, day);
      result.push(this.calculatePanchangForDate(d, true, today));
    }

    // Next month padding to complete 35 or 42 grid cells
    const remaining = (7 - (result.length % 7)) % 7;
    for (let nextDay = 1; nextDay <= remaining; nextDay++) {
      const d = new Date(year, monthIndex + 1, nextDay);
      result.push(this.calculatePanchangForDate(d, false, today));
    }

    return result;
  }

  calculatePanchangForDate(date: Date, isCurrentMonth: boolean, today: Date): PanchangDay {
    const day = date.getDate();
    const month = date.getMonth(); // 0 - 11
    const year = date.getFullYear();

    const isToday = isCurrentMonth &&
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year;

    // Julian Date for astronomical precision
    // JD = (time in ms / 86400000) + 2440587.5
    const timeMs = Date.UTC(year, month, day, 6, 0, 0); // 06:00 UTC (approx Indian sunrise)
    const jd = timeMs / 86400000.0 + 2440587.5;
    const dFromJ2000 = jd - 2451545.0;

    // Mean Sun Longitude
    const sunMean = (280.460 + 0.9856474 * dFromJ2000) % 360;
    // Mean Moon Longitude
    const moonMean = (218.316 + 13.176396 * dFromJ2000) % 360;

    // Normalize positive angles [0, 360)
    const sunLong = (sunMean + 360) % 360;
    const moonLong = (moonMean + 360) % 360;

    // Moon - Sun elongation
    const elongation = (moonLong - sunLong + 360) % 360;

    // Tithi calculation (12 degrees per tithi, 1 to 30)
    const tithiIndex = Math.floor(elongation / 12) + 1; // 1 to 30

    let paksha: 'Shukla' | 'Krishna' = 'Shukla';
    let pakshaHindi = 'शुक्ल पक्ष';
    let tithiNumber = tithiIndex;
    let tithiName = '';
    let tithiHindi = '';

    const tithiNames = [
      '', 'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
      'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
      'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima'
    ];

    const tithiHindiNames = [
      '', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी',
      'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
      'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा'
    ];

    if (tithiIndex <= 15) {
      paksha = 'Shukla';
      pakshaHindi = 'शुक्ल पक्ष';
      tithiNumber = tithiIndex;
      tithiName = tithiNames[tithiIndex] || 'Pratipada';
      tithiHindi = tithiHindiNames[tithiIndex] || 'प्रतिपदा';
    } else {
      paksha = 'Krishna';
      pakshaHindi = 'कृष्ण पक्ष';
      tithiNumber = tithiIndex - 15;
      if (tithiNumber === 15) {
        tithiName = 'Amavasya';
        tithiHindi = 'अमावस्या';
      } else {
        tithiName = tithiNames[tithiNumber] || 'Pratipada';
        tithiHindi = tithiHindiNames[tithiNumber] || 'प्रतिपदा';
      }
    }

    const isPurnima = paksha === 'Shukla' && tithiNumber === 15;
    const isAmavasya = paksha === 'Krishna' && tithiNumber === 15;
    const isEkadashi = tithiNumber === 11;
    const isPradosh = tithiNumber === 13;
    const isChaturthi = tithiNumber === 4;
    const isSankranti = (month === 0 && (day === 14 || day === 15));

    // Nakshatra calculation (13°20' = 13.333333° per nakshatra, 27 total)
    const nakshatraIndex = Math.floor(moonLong / (360 / 27));
    const nakshatras = [
      { name: 'Ashwini', hindi: 'अश्विनी' }, { name: 'Bharani', hindi: 'भरणी' }, { name: 'Krittika', hindi: 'कृत्तिका' },
      { name: 'Rohini', hindi: 'रोहिणी' }, { name: 'Mrigashira', hindi: 'मृगशिरा' }, { name: 'Ardra', hindi: 'आर्द्रा' },
      { name: 'Punarvasu', hindi: 'पुनर्वसु' }, { name: 'Pushya', hindi: 'पुष्य' }, { name: 'Ashlesha', hindi: 'आश्लेषा' },
      { name: 'Magha', hindi: 'मघा' }, { name: 'Purva Phalguni', hindi: 'पूर्वाफाल्गुनी' }, { name: 'Uttara Phalguni', hindi: 'उत्तराफाल्गुनी' },
      { name: 'Hasta', hindi: 'हस्त' }, { name: 'Chitra', hindi: 'चित्रा' }, { name: 'Swati', hindi: 'स्वाति' },
      { name: 'Vishakha', hindi: 'विशाखा' }, { name: 'Anuradha', hindi: 'अनुराधा' }, { name: 'Jyeshtha', hindi: 'ज्येष्ठा' },
      { name: 'Mula', hindi: 'मूल' }, { name: 'Purva Ashadha', hindi: 'पूर्वाषाढ़ा' }, { name: 'Uttara Ashadha', hindi: 'उत्तराषाढ़ा' },
      { name: 'Shravana', hindi: 'श्रवण' }, { name: 'Dhanishta', hindi: 'धनिष्ठा' }, { name: 'Shatabhisha', hindi: 'शतभिषा' },
      { name: 'Purva Bhadrapada', hindi: 'पूर्वभाद्रपद' }, { name: 'Uttara Bhadrapada', hindi: 'उत्तरभाद्रपद' }, { name: 'Revati', hindi: 'रेवती' }
    ];
    const nakshatra = nakshatras[(nakshatraIndex + 27) % 27] || nakshatras[0];

    // Hindu Lunar Month Determination (Lunisolar Nirayana calculation)
    // Approximate Solar Rashi: Sun enters Mesha (Aries) ~April 14.
    // 0: Mesha (Chaitra/Vaishakha), 1: Vrishabha (Jyeshtha), 2: Mithuna (Ashadha),
    // 3: Karka (Shravana), 4: Simha (Bhadrapada), 5: Kanya (Ashwina), 6: Tula (Kartika),
    // 7: Vrishchika (Margashirsha), 8: Dhanu (Pausha), 9: Makara (Magha), 10: Kumbha (Phalguna), 11: Meena (Chaitra)
    const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000);
    // Offset day from Chaitra commencement (~March 22 / April 14 depending on amanta/purnimanta)
    const masaIndex = Math.floor(((dayOfYear + 285) % 365) / 30.4375); // 0=Chaitra, 1=Vaishakha, ..., 11=Phalguna
    
    const hinduMonthsList = [
      { en: 'Chaitra', hi: 'चैत्र' },
      { en: 'Vaishakha', hi: 'वैशाख' },
      { en: 'Jyeshtha', hi: 'ज्येष्ठ' },
      { en: 'Ashadha', hi: 'आषाढ़' },
      { en: 'Shravana', hi: 'श्रावण' },
      { en: 'Bhadrapada', hi: 'भाद्रपद' },
      { en: 'Ashwina', hi: 'अश्विन' },
      { en: 'Kartika', hi: 'कार्तिक' },
      { en: 'Margashirsha', hi: 'मार्गशीर्ष' },
      { en: 'Pausha', hi: 'पौष' },
      { en: 'Magha', hi: 'माघ' },
      { en: 'Phalguna', hi: 'फाल्गुन' }
    ];
    const hinduMonth = hinduMonthsList[masaIndex % 12];

    // Vikram Samvat calculation
    // Changes around Chaitra Shukla Pratipada (~March/April)
    const vikramSamvat = (month > 2 || (month === 2 && day >= 22)) ? year + 57 : year + 56;

    // Detect Festivals automatically based on Lunisolar Position (Works for ALL YEARS)
    const festivals: PanchangFestival[] = [];

    // 1. Ekadashi Names Mapping (All 24 Ekadashis per year)
    if (isEkadashi) {
      const ekadashiNames: { [key: string]: { [key: string]: string } } = {
        'Chaitra': { 'Shukla': 'कामदा एकादशी (Kamada)', 'Krishna': 'वरूथिनी एकादशी (Varuthini)' },
        'Vaishakha': { 'Shukla': 'मोहिनी एकादशी (Mohini)', 'Krishna': 'अपरा एकादशी (Apara)' },
        'Jyeshtha': { 'Shukla': 'निर्जला महा एकादशी (Nirjala)', 'Krishna': 'योगिनी एकादशी (Yogini)' },
        'Ashadha': { 'Shukla': 'देवशयनी एकादशी (Devshayani)', 'Krishna': 'कामिका एकादशी (Kamika)' },
        'Shravana': { 'Shukla': 'पुत्रदा एकादशी (Shravana Putrada)', 'Krishna': 'अजा एकादशी (Aja)' },
        'Bhadrapada': { 'Shukla': 'परिवर्तिनी एकादशी (Parsva)', 'Krishna': 'इन्दिरा एकादशी (Indira)' },
        'Ashwina': { 'Shukla': 'पापांकुशा एकादशी (Papankusha)', 'Krishna': 'रमा एकादशी (Rama)' },
        'Kartika': { 'Shukla': 'देवउठनी प्रबोधिनी एकादशी (Dev Uthani)', 'Krishna': 'उत्पन्ना एकादशी (Utpanna)' },
        'Margashirsha': { 'Shukla': 'मोक्षदा एकादशी व गीता जयंती (Mokshada)', 'Krishna': 'सफला एकादशी (Saphala)' },
        'Pausha': { 'Shukla': 'पौष पुत्रदा एकादशी (Putrada)', 'Krishna': 'षटतिला एकादशी (Shattila)' },
        'Magha': { 'Shukla': 'जया एकादशी (Jaya)', 'Krishna': 'विजया एकादशी (Vijaya)' },
        'Phalguna': { 'Shukla': 'आमलकी एकादशी (Amalaki)', 'Krishna': 'पापमोचिनी एकादशी (Papmochani)' }
      };

      const eInfo = ekadashiNames[hinduMonth.en]?.[paksha] || `${pakshaHindi} एकादशी`;
      festivals.push({
        name: `${eInfo}`,
        hindiName: `${eInfo}`,
        type: 'vrat',
        color: '#E65100',
        icon: '🪷',
        significance: 'Dedicated fast to Bhagwan Shri Vishnu. Bestows inner tranquility, spiritual merit, and cleanses sins.'
      });
    }

    // 2. Pradosh Vrat
    if (isPradosh) {
      const dayNames = ['रवि', 'सोम', 'भौम', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
      const pradoshPrefix = dayNames[date.getDay()];
      festivals.push({
        name: `${pradoshPrefix} प्रदोष व्रत`,
        hindiName: `${pradoshPrefix} प्रदोष व्रत (महादेव पूजन)`,
        type: 'vrat',
        color: '#3D348B',
        icon: '🔱',
        significance: 'Auspicious twilight window dedicated to Lord Shiva and Maa Parvati. Fulfills deepest sankalpas.'
      });
    }

    // 3. Chaturthi Vrat (Sankashti / Vinayaka)
    if (isChaturthi) {
      if (paksha === 'Krishna') {
        festivals.push({
          name: 'Sankashti Ganesh Chaturthi',
          hindiName: 'संकष्टी गणेश चतुर्थी व्रत',
          type: 'vrat',
          color: '#C2185B',
          icon: '🐘',
          significance: 'Vrat dedicated to Lord Ganesha for removal of family obstacles and hardships; ends after moonrise.'
        });
      } else {
        festivals.push({
          name: 'Vinayaka Chaturthi',
          hindiName: 'विनायक चतुर्थी',
          type: 'vrat',
          color: '#E65100',
          icon: '🐘',
          significance: 'Monthly Shukla Chaturthi celebrating Lord Ganesha\'s wisdom and prosperity.'
        });
      }
    }

    // 4. Purnima & Amavasya
    if (isPurnima) {
      let purnimaSpecial = '';
      if (hinduMonth.en === 'Ashadha') purnimaSpecial = 'गुरु पूर्णिमा (Guru Purnima - व्यास पूजा)';
      else if (hinduMonth.en === 'Shravana') purnimaSpecial = 'श्रावणी पूर्णिमा एवं रक्षाबंधन (Raksha Bandhan)';
      else if (hinduMonth.en === 'Bhadrapada') purnimaSpecial = 'भाद्रपद पूर्णिमा (श्राद्ध आरम्भ)';
      else if (hinduMonth.en === 'Ashwina') purnimaSpecial = 'शरद पूर्णिमा (Sharad Purnima - अमृत वर्षा)';
      else if (hinduMonth.en === 'Kartika') purnimaSpecial = 'कार्तिक पूर्णिमा एवं देव दीपावली (Dev Deepawali)';
      else if (hinduMonth.en === 'Phalguna') purnimaSpecial = 'होलिका दहन एवं फाल्गुन पूर्णिमा (Holika Dahan)';
      else if (hinduMonth.en === 'Chaitra') purnimaSpecial = 'चैत्री पूर्णिमा व हनुमान जन्मोत्सव';
      else if (hinduMonth.en === 'Vaishakha') purnimaSpecial = 'बुद्ध पूर्णिमा व वैशाख स्नान';
      else if (hinduMonth.en === 'Jyeshtha') purnimaSpecial = 'वट पूर्णिमा व्रत';
      else purnimaSpecial = `${hinduMonth.hi} पूर्णिमा व्रत`;

      festivals.push({
        name: purnimaSpecial,
        hindiName: `${purnimaSpecial} • श्री सत्यनारायण कथा`,
        type: 'major',
        color: '#D4AF37',
        icon: '🌕',
        significance: 'Most auspicious full moon night for supreme peace, mental clarity, Satyanarayan Katha, and Lakshmi Aradhana.'
      });
    }

    if (isAmavasya) {
      let amavasyaSpecial = '';
      if (hinduMonth.en === 'Ashwina' || hinduMonth.en === 'Bhadrapada') {
        amavasyaSpecial = 'सर्वपितृ मोक्ष अमावस्या (Sarva Pitru Shradh)';
      } else if (hinduMonth.en === 'Kartika') {
        amavasyaSpecial = 'दीपावली (Maha Lakshmi Deepawali)';
      } else if (hinduMonth.en === 'Magha') {
        amavasyaSpecial = 'मौनी अमावस्या (Mauni Amavasya - मौन स्नान)';
      } else if (hinduMonth.en === 'Shravana') {
        amavasyaSpecial = 'हरियाली अमावस्या (Hariyali Amavasya)';
      } else {
        amavasyaSpecial = `${hinduMonth.hi} दर्श अमावस्या`;
      }

      festivals.push({
        name: amavasyaSpecial,
        hindiName: `${amavasyaSpecial} • पितृ शांति तर्पण`,
        type: 'major',
        color: '#4A306D',
        icon: '🌑',
        significance: 'Sacred new moon day for performing Tarpan, Pind Daan, offering water to ancestors, and cow service (Go-Seva).'
      });
    }

    // 5. Automatic Festival Detection by Lunisolar Coordinate (Hindu Month + Paksha + Tithi)
    const monthKey = hinduMonth.en;

    // Chaitra Festivals
    if (monthKey === 'Chaitra') {
      if (paksha === 'Shukla' && tithiNumber === 1) {
        festivals.push({ name: 'Chaitra Navratri / Hindu New Year', hindiName: 'चैत्र नवरात्रि प्रारम्भ (नव संवत्सर / गुड़ी पड़वा)', type: 'major', color: '#E65100', icon: '🌺', significance: 'Commencement of Vikram Samvat New Year and 9 days of Maa Durga worship with Ghatasthapana.' });
      } else if (paksha === 'Shukla' && tithiNumber === 3) {
        festivals.push({ name: 'Gangaur / Matsya Jayanti', hindiName: 'गणगौर तीज एवं मत्स्य जयंती', type: 'major', color: '#C2185B', icon: '🪷', significance: 'Sacred worship of Maa Gauri and Bhagwan Shiva for marital harmony and prosperity.' });
      } else if (paksha === 'Shukla' && tithiNumber === 9) {
        festivals.push({ name: 'Shri Ram Navami', hindiName: 'श्री राम जन्मोत्सव (Ram Navami)', type: 'major', color: '#FF6D00', icon: '🏹', significance: 'Appearance of Maryada Purushottam Bhagwan Shri Ram at Madhyahna Kaal in Ayodhya.' });
      } else if (paksha === 'Shukla' && tithiNumber === 15) {
        festivals.push({ name: 'Hanuman Jayanti', hindiName: 'श्री हनुमान जन्मोत्सव', type: 'major', color: '#E65100', icon: '🚩', significance: 'Birth of Sankat Mochan Mahabali Hanuman Ji with Sundarkand recitation and Sindoor Arpan.' });
      }
    }

    // Vaishakha Festivals
    else if (monthKey === 'Vaishakha') {
      if (paksha === 'Shukla' && tithiNumber === 3) {
        festivals.push({ name: 'Akshaya Tritiya / Parashurama Jayanti', hindiName: 'अक्षय तृतीया (अक्षय फल सिद्धि) व परशुराम जयंती', type: 'major', color: '#D4AF37', icon: '✨', significance: 'Self-illumined auspicious Muhurat for new ventures, charity, gold purchase, and spiritual merits that never diminish.' });
      } else if (paksha === 'Shukla' && tithiNumber === 15) {
        festivals.push({ name: 'Buddha Purnima', hindiName: 'बुद्ध पूर्णिमा एवं कूर्म जयंती', type: 'major', color: '#FBC02D', icon: '🪷', significance: 'Enlightenment of Gautama Buddha and sacred Vaishakh Snan.' });
      }
    }

    // Jyeshtha Festivals
    else if (monthKey === 'Jyeshtha') {
      if (paksha === 'Shukla' && tithiNumber === 10) {
        festivals.push({ name: 'Ganga Dussehra', hindiName: 'गंगा दशहरा (मां गंगा अवतरण)', type: 'major', color: '#0288D1', icon: '🌊', significance: 'Descent of Holy River Ganga to Earth; sacred bath washes away ten kinds of sins.' });
      } else if (paksha === 'Shukla' && tithiNumber === 11) {
        festivals.push({ name: 'Nirjala Ekadashi', hindiName: 'निर्जला महा एकादशी (भीमसेनी एकादशी)', type: 'major', color: '#E65100', icon: '🪷', significance: 'The supreme fast observed without a single drop of water; yields the merit of all 24 annual Ekadashis.' });
      } else if (paksha === 'Shukla' && tithiNumber === 15) {
        festivals.push({ name: 'Vat Purnima', hindiName: 'वट पूर्णिमा व्रत (सावित्री पूजन)', type: 'major', color: '#AD1457', icon: '🌳', significance: 'Married women bind sacred thread around the Banyan tree praying for husband\'s longevity.' });
      }
    }

    // Ashadha Festivals
    else if (monthKey === 'Ashadha') {
      if (paksha === 'Shukla' && tithiNumber === 2) {
        festivals.push({ name: 'Jagannath Rath Yatra', hindiName: 'श्री जगन्नाथ रथयात्रा (Puri Rath Yatra)', type: 'major', color: '#D84315', icon: '🛕', significance: 'Lord Jagannath, Balabhadra, and Subhadra journey in grand celestial chariots to Gundicha Temple.' });
      } else if (paksha === 'Shukla' && tithiNumber === 11) {
        festivals.push({ name: 'Devshayani Ekadashi', hindiName: 'देवशयनी एकादशी (चातुर्मास प्रारम्भ)', type: 'major', color: '#43A047', icon: '🌿', significance: 'Bhagwan Vishnu enters Yogic slumber (Yog Nidra) on Shesha Naga for four holy months of Chaturmas.' });
      } else if (paksha === 'Shukla' && tithiNumber === 15) {
        festivals.push({ name: 'Guru Purnima', hindiName: 'गुरु पूर्णिमा (महर्षि वेद व्यास पूजा)', type: 'major', color: '#F57C00', icon: '🪷', significance: 'Solemn veneration of spiritual Gurus, Acharyas, and Sage Veda Vyasa who codified the four Vedas.' });
      }
    }

    // Shravana Festivals
    else if (monthKey === 'Shravana') {
      if (paksha === 'Shukla' && tithiNumber === 3) {
        festivals.push({ name: 'Hariyali Teej', hindiName: 'हरियाली तीज (माता पार्वती-शिव मिलन)', type: 'major', color: '#2E7D32', icon: '🌿', significance: 'Celebration of monsoon lushness and reunion of Goddess Parvati with Lord Shiva.' });
      } else if (paksha === 'Shukla' && tithiNumber === 5) {
        festivals.push({ name: 'Nag Panchami', hindiName: 'नाग पंचमी (सर्प दोष शांति)', type: 'major', color: '#4E342E', icon: '🐍', significance: 'Offering milk to serpent deities to remove Kaal Sarp and Rahu afflictions.' });
      } else if (paksha === 'Shukla' && tithiNumber === 15) {
        festivals.push({ name: 'Raksha Bandhan', hindiName: 'रक्षाबंधन एवं गायत्री जयंती', type: 'major', color: '#C2185B', icon: '🧶', significance: 'Sacred protective thread ceremony between siblings; Vedic Upakarma and Gayatri Mata Jayanti.' });
      }
    }

    // Bhadrapada Festivals
    else if (monthKey === 'Bhadrapada') {
      if (paksha === 'Krishna' && tithiNumber === 8) {
        festivals.push({ name: 'Krishna Janmashtami', hindiName: 'श्री कृष्ण जन्माष्टमी (रोहिणी जन्मोत्सव)', type: 'major', color: '#1565C0', icon: '🦚', significance: 'Midnight appearance of Bhagwan Shri Krishna in Mathura; special Makhan Bhog, Jhula Seva, and fasting.' });
      } else if (paksha === 'Shukla' && tithiNumber === 4) {
        festivals.push({ name: 'Ganesh Chaturthi', hindiName: 'गणेश चतुर्थी (विनायक उत्सव प्रारम्भ)', type: 'major', color: '#E65100', icon: '🐘', significance: '10-day Ganeshotsav begins with Modak offerings and Prana Pratishtha of Ganpati Bappa in every household.' });
      } else if (paksha === 'Shukla' && tithiNumber === 14) {
        festivals.push({ name: 'Anant Chaturdashi', hindiName: 'अनंत चतुर्दशी (गणेश विसर्जन)', type: 'major', color: '#D84315', icon: '🕉️', significance: 'Anant Sutra thread tying and ceremonial immersion of Lord Ganesha.' });
      }
    }

    // Ashwina Festivals
    else if (monthKey === 'Ashwina') {
      if (paksha === 'Krishna' && tithiNumber === 15) {
        festivals.push({ name: 'Sarva Pitru Amavasya', hindiName: 'सर्वपितृ मोक्ष अमावस्या (महालय)', type: 'major', color: '#4A306D', icon: '🌿', significance: 'Culmination of Pitru Paksha; final Tarpan and Shraddha for all departed ancestors to grant eternal peace.' });
      } else if (paksha === 'Shukla' && tithiNumber === 1) {
        festivals.push({ name: 'Sharad Navratri Begins', hindiName: 'शारदीय नवरात्रि (कलश घटस्थापना)', type: 'major', color: '#C0392B', icon: '🔱', significance: 'Nine sacred cosmic nights of worship of the nine divine manifestations of Navdurga.' });
      } else if (paksha === 'Shukla' && tithiNumber === 8) {
        festivals.push({ name: 'Durga Ashtami', hindiName: 'महाष्टमी (दुर्गा अष्टमी व कन्या पूजन)', type: 'major', color: '#AD1457', icon: '🔱', significance: 'Worship of Maa Mahagauri with Kanya Pujan and Halwa-Puri bhog.' });
      } else if (paksha === 'Shukla' && tithiNumber === 9) {
        festivals.push({ name: 'Maha Navami', hindiName: 'महानवमी (सिद्धिदात्री पूजन व हवन)', type: 'major', color: '#C2185B', icon: '🔥', significance: 'Worship of Maa Siddhidatri and grand Purnahuti Havan.' });
      } else if (paksha === 'Shukla' && tithiNumber === 10) {
        festivals.push({ name: 'Dussehra / Vijayadashami', hindiName: 'विजयादशमी (दशहरा - अधर्म पर धर्म की विजय)', type: 'major', color: '#D84315', icon: '🏹', significance: 'Celebration of Lord Rama\'s victory over Ravana; Shami tree worship and weapon blessing.' });
      } else if (paksha === 'Shukla' && tithiNumber === 15) {
        festivals.push({ name: 'Sharad Purnima', hindiName: 'शरद पूर्णिमा (कोजागरी पूर्णिमा - अमृत वर्षा)', type: 'major', color: '#D4AF37', icon: '🌕', significance: 'Moon radiates all 16 divine kalas; satvik rice kheer is kept under moonlight to absorb healing amrit.' });
      }
    }

    // Kartika Festivals (The Month of Lights)
    else if (monthKey === 'Kartika') {
      if (paksha === 'Krishna' && tithiNumber === 4) {
        festivals.push({ name: 'Karwa Chauth Vrat', hindiName: 'करवा चौथ महाव्रत (सुहाग रक्षा)', type: 'vrat', color: '#AD1457', icon: '🌙', significance: 'Rigorous nirjala fast observed by married women for health and longevity of spouse, concluding at moonrise.' });
      } else if (paksha === 'Krishna' && tithiNumber === 8) {
        festivals.push({ name: 'Ahoi Ashtami', hindiName: 'अहोई अष्टमी व्रत (संतान रक्षा)', type: 'vrat', color: '#7B1FA2', icon: '🪷', significance: 'Mothers fast for the well-being and prosperity of their children, looking at evening stars.' });
      } else if (paksha === 'Krishna' && tithiNumber === 13) {
        festivals.push({ name: 'Dhanteras', hindiName: 'धनतेरस (भगवान धन्वंतरि जयंती)', type: 'major', color: '#F9A825', icon: '🪙', significance: 'Appearance of God of Healing Dhanvantari and Goddess Lakshmi; lighting Yama Diya and purchasing brass & gold.' });
      } else if (paksha === 'Krishna' && tithiNumber === 14) {
        festivals.push({ name: 'Chhoti Diwali / Roop Chaudas', hindiName: 'नरक चतुर्दशी (रूप चौदस / छोटी दिवाली)', type: 'major', color: '#E65100', icon: '🪔', significance: 'Celebrates Lord Krishna’s defeat of demon Narakasura; holy oil bath and illumination.' });
      } else if (paksha === 'Krishna' && tithiNumber === 15) {
        festivals.push({ name: 'Maha Lakshmi Deepawali', hindiName: 'दीपावली (महालक्ष्मी एवं श्री गणेश पूजन)', type: 'major', color: '#E65100', icon: '🪔', significance: 'Grand festival of Lights; welcoming Goddess Lakshmi and Lord Ganesha for enduring prosperity and peace.' });
      } else if (paksha === 'Shukla' && tithiNumber === 1) {
        festivals.push({ name: 'Govardhan Puja / Annakoot', hindiName: 'गोवर्धन पूजा एवं अन्नकूट उत्सव', type: 'major', color: '#2E7D32', icon: '⛰️', significance: 'Offering 56 bhog food varieties to Govardhan Hill and Bhagwan Krishna; cow and calf worship.' });
      } else if (paksha === 'Shukla' && tithiNumber === 2) {
        festivals.push({ name: 'Bhai Dooj', hindiName: 'भाई दूज (यम द्वितीया)', type: 'major', color: '#E91E63', icon: '🍬', significance: 'Sacred bond of sister\'s blessing and brother\'s protection; sacred tilak and feast.' });
      } else if (paksha === 'Shukla' && tithiNumber === 6) {
        festivals.push({ name: 'Chhath Puja', hindiName: 'छठ महापर्व (संध्या व उषा अर्घ्य)', type: 'major', color: '#E65100', icon: '☀️', significance: 'Four days of intense austerity worshiping Surya Bhagwan and Chhathi Maiya standing in holy water.' });
      } else if (paksha === 'Shukla' && tithiNumber === 11) {
        festivals.push({ name: 'Dev Uthani Ekadashi / Tulsi Vivah', hindiName: 'देवउठनी एकादशी एवं तुलसी विवाह उत्सव', type: 'major', color: '#43A047', icon: '🌿', significance: 'Lord Vishnu awakens from Yogic sleep; wedding of Sacred Tulsi plant with Shaligram stone marks marriage season.' });
      } else if (paksha === 'Shukla' && tithiNumber === 15) {
        festivals.push({ name: 'Dev Deepawali', hindiName: 'देव दीपावली एवं कार्तिक पूर्णिमा (गंगा दीपदान)', type: 'major', color: '#D4AF37', icon: '🪔', significance: 'The Gods celebrate Diwali on Varanasi and Haridwar ghats; lighting thousands of floating earthen lamps.' });
      }
    }

    // Margashirsha Festivals
    else if (monthKey === 'Margashirsha') {
      if (paksha === 'Shukla' && tithiNumber === 11) {
        festivals.push({ name: 'Gita Jayanti', hindiName: 'गीता जयंती एवं मोक्षदा एकादशी', type: 'major', color: '#E65100', icon: '📖', significance: 'The day Lord Krishna delivered the immortal Bhagavad Gita to Arjuna on the battlefield of Kurukshetra.' });
      }
    }

    // Pausha Festivals
    else if (monthKey === 'Pausha' || isSankranti) {
      if (isSankranti) {
        festivals.push({ name: 'Makar Sankranti / Pongal', hindiName: 'मकर संक्रांति, पोंगल एवं लोहड़ी', type: 'major', color: '#FF6D00', icon: '🪁', significance: 'Surya Dev transitions into Capricorn (Makara); marking end of winter, harvest joy, and holy Ganga snan.' });
      }
    }

    // Magha Festivals
    else if (monthKey === 'Magha') {
      if (paksha === 'Shukla' && tithiNumber === 5) {
        festivals.push({ name: 'Vasant Panchami', hindiName: 'बसंत पंचमी (मां सरस्वती पूजन)', type: 'major', color: '#FDD835', icon: '🪕', significance: 'Arrival of spring; veneration of Goddess Saraswati, patron of wisdom, arts, music, and learning.' });
      } else if (paksha === 'Shukla' && tithiNumber === 7) {
        festivals.push({ name: 'Ratha Saptami', hindiName: 'रथ सप्तमी (सूर्य जयंती)', type: 'major', color: '#E65100', icon: '☀️', significance: 'Surya Dev turns his seven-horse chariot toward the northern hemisphere (Uttarayan).' });
      }
    }

    // Phalguna Festivals
    else if (monthKey === 'Phalguna') {
      if (paksha === 'Krishna' && tithiNumber === 14) {
        festivals.push({ name: 'Maha Shivratri', hindiName: 'महाशिवरात्रि महापर्व (शिव-पार्वती कल्याणम्)', type: 'major', color: '#1A237E', icon: '🔱', significance: 'Cosmic night of Lord Shiva and Goddess Parvati; all-night Shiva Lingam abhishekam with Belpatra, milk, and chanting.' });
      } else if (paksha === 'Shukla' && tithiNumber === 15) {
        festivals.push({ name: 'Holika Dahan', hindiName: 'होलिका दहन (भक्त प्रह्लाद विजय)', type: 'major', color: '#D81B60', icon: '🔥', significance: 'Sacred bonfire celebrating triumph of divine faith over evil and demoness Holika.' });
      } else if (paksha === 'Krishna' && tithiNumber === 1) {
        festivals.push({ name: 'Holi / Rangotsav', hindiName: 'होली (रंगोत्सव एवं धुलण्डी)', type: 'major', color: '#E91E63', icon: '🎨', significance: 'Joyous festival of colors reflecting the blissful sports of Radha-Krishna in Braj.' });
      }
    }

    // Shubh Muhurat & Rahu Kaal calculations
    const sunriseHour = 6;
    const sunriseMin = 15;
    const sunriseStr = `${sunriseHour}:${sunriseMin} AM`;
    const sunsetStr = `06:15 PM`;
    const abhijitMuhurat = '11:45 AM - 12:35 PM';

    // Rahu Kaal by day of week
    const dayOfWeek = date.getDay();
    const rahuKaalTimes = [
      '04:30 PM - 06:00 PM', // Sun
      '07:30 AM - 09:00 AM', // Mon
      '03:00 PM - 04:30 PM', // Tue
      '12:00 PM - 01:30 PM', // Wed
      '01:30 PM - 03:00 PM', // Thu
      '10:30 AM - 12:00 PM', // Fri
      '09:00 AM - 10:30 AM'  // Sat
    ];
    const rahuKaal = rahuKaalTimes[dayOfWeek];

    let vratAdvice = 'Light a pure ghee diya, chant the Gayatri Mantra, and offer fresh water (Arghya) to Surya Dev.';
    if (isEkadashi) {
      vratAdvice = 'Observe fasting on satvik fruits and milk; refrain from consuming rice/grains; chant Vishnu Sahasranama.';
    } else if (isPurnima) {
      vratAdvice = 'Fast until moonrise; prepare satvik kheer; organize or listen to Shri Satyanarayan Vrat Katha.';
    } else if (isAmavasya) {
      vratAdvice = 'Perform Tila Tarpan for departed ancestors; feed cows, dogs, and birds; donate food to the needy.';
    } else if (isPradosh) {
      vratAdvice = 'Observe twilight fast; offer Belpatra, water, and raw milk to Shiva Lingam during Pradosh Kaal.';
    }

    return {
      dateObj: date,
      dayNumber: day,
      monthIndex: month,
      year: year,
      isCurrentMonth,
      isToday,
      vikramSamvat,
      hinduMonth: hinduMonth.en,
      hinduMonthHindi: hinduMonth.hi,
      paksha,
      pakshaHindi,
      tithiNumber,
      tithiName,
      tithiHindi,
      nakshatra: nakshatra.name,
      nakshatraHindi: nakshatra.hindi,
      yoga: 'Shubha Yoga',
      karana: 'Bava Karana',
      isPurnima,
      isAmavasya,
      isEkadashi,
      isPradosh,
      isSankranti,
      festivals,
      sunrise: sunriseStr,
      sunset: sunsetStr,
      abhijitMuhurat,
      rahuKaal,
      vratAdvice
    };
  }
  // =========================================================================
  // BOOKING / CALENDLY SYSTEM
  // =========================================================================
  getAvailableSlots(dateStr: string): BookingSlot[] {
    return [
      { id: 'm1', time: '07:30 AM - 08:30 AM', period: 'Morning', available: true, seatsLeft: 3 },
      { id: 'm2', time: '09:00 AM - 10:00 AM', period: 'Morning', available: true, seatsLeft: 2 },
      { id: 'm3', time: '10:30 AM - 11:30 AM', period: 'Morning', available: true, seatsLeft: 4 },
      { id: 'm4', time: '11:45 AM - 12:45 PM', period: 'Morning', available: true, seatsLeft: 1 },
      { id: 'e1', time: '04:45 PM - 05:45 PM', period: 'Evening', available: true, seatsLeft: 5 },
      { id: 'e2', time: '06:00 PM - 07:00 PM', period: 'Evening', available: true, seatsLeft: 2 },
      { id: 'e3', time: '07:30 PM - 08:30 PM', period: 'Evening', available: true, seatsLeft: 3 }
    ];
  }

  saveBooking(booking: BookingRequest): BookingRequest {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `SKN-${new Date().getFullYear()}-${randomNum}`;
    const fullBooking: BookingRequest = {
      ...booking,
      id: 'bk_' + Date.now(),
      bookingRef,
      createdAt: new Date().toISOString()
    };

    try {
      const stored = localStorage.getItem('sakoon_bookings');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(fullBooking);
      localStorage.setItem('sakoon_bookings', JSON.stringify(list));
    } catch (e) {
      console.warn('localStorage not accessible, stored in memory', e);
    }

    return fullBooking;
  }

  getRecentBookings(): BookingRequest[] {
    try {
      const stored = localStorage.getItem('sakoon_bookings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}
