import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CountryTimezoneService } from '../../services/country-timezone.service';
import { CountryConfig } from '../../models/country.models';

interface ContactFaq {
  q: string;
  a: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent implements OnInit {
  readonly countryTzService = inject(CountryTimezoneService);
  readonly allCountries = this.countryTzService.allCountries;

  // Simple, elegant form fields
  name = '';
  selectedCountryCode = 'IN';
  phoneCode = '+91';
  phone = '';
  email = '';
  queryTopic = 'Puja & Rituals Booking';
  message = '';

  // Quick Subject Options
  readonly subjectOptions = [
    { label: 'Puja & Rituals Booking', icon: '🪷', desc: 'Havan, Abhishek & Special Sankalpa' },
    { label: 'Kundali & Jyotish Paramarsh', icon: '✨', desc: 'Vedic Astrology Consultation' },
    { label: 'General Darshan & Aarti', icon: '🛕', desc: 'Sanctum Timings & Visitor Help' },
    { label: 'Goshala & Anna Daan Seva', icon: '🍲', desc: 'Temple Charity & Sacred Offerings' },
    { label: 'Other Query / Assistance', icon: '🙏', desc: 'Any other spiritual inquiry' }
  ];

  // Submission signals
  touched = signal<{ name: boolean; phone: boolean; email: boolean }>({
    name: false,
    phone: false,
    email: false
  });
  isSubmitting = signal(false);
  isSubmitted = signal(false);
  ticketRef = signal('');
  submittedAt = signal('');
  isCopied = signal(false);

  // Temple Interactive FAQs
  readonly faqs = signal<ContactFaq[]>([
    {
      q: 'Is there an entry fee or ticket required to visit Sakoon Temple?',
      a: 'No. General Darshan at Sakoon Temple is completely free for all devotees from all walks of life. Free satvik charanamrit and prasad are distributed after morning and evening Aartis.',
      isOpen: true
    },
    {
      q: 'Can devotees from other countries participate in Online / Virtual Pujas?',
      a: 'Yes, absolutely! Devotees residing in the USA, UK, Canada, Australia, UAE, Europe, and worldwide can book personalized Vedic Pujas. Our Acharyas take your Gotra and Sankalpa live over high-definition video stream and ship blessed Prasad internationally.',
      isOpen: false
    },
    {
      q: 'How can I schedule a personal Havan, Kundali reading, or new car Vahan Pujan?',
      a: 'You can book directly via our "Book Slot" page or call/WhatsApp our Priest Helpline (+91 98765 43210). Prior booking ensures personalized attention and prepared Vedic samagri.',
      isOpen: false
    },
    {
      q: 'What is the recommended dress code and temple etiquette?',
      a: 'Modest traditional attire is recommended. Devotees are requested to remove footwear at the free shoe counter and keep mobile phones on silent mode within the sanctum.',
      isOpen: false
    },
    {
      q: 'Where can pilgrims park their vehicles and are wheelchairs available?',
      a: 'The temple complex features free secure parking accommodating 300+ vehicles, gentle marble wheelchair ramps, free wheelchairs at the gate, and battery cart assistance for elders.',
      isOpen: false
    }
  ]);

  ngOnInit(): void {
    // Sync default phone code with user's selected country
    const userCountry = this.countryTzService.selectedCountry();
    if (userCountry) {
      this.selectedCountryCode = userCountry.code;
      this.phoneCode = userCountry.phoneCode;
    }
  }

  onCountrySelectChange(code: string): void {
    this.selectedCountryCode = code;
    const found = this.allCountries.find(c => c.code === code);
    if (found) {
      this.phoneCode = found.phoneCode;
      this.countryTzService.setCountry(code);
    }
  }

  toggleFaq(index: number): void {
    this.faqs.update(list => {
      const copy = [...list];
      copy[index] = { ...copy[index], isOpen: !copy[index].isOpen };
      return copy;
    });
  }

  markTouched(field: 'name' | 'phone' | 'email'): void {
    this.touched.update(t => ({ ...t, [field]: true }));
  }

  isNameValid(): boolean {
    return this.name.trim().length >= 2;
  }

  isPhoneValid(): boolean {
    const clean = this.phone.replace(/[\s\-\(\)\+]/g, '');
    return clean.length >= 7;
  }

  isEmailValid(): boolean {
    if (!this.email) return true; // Optional field
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());
  }

  onSubmit(): void {
    this.touched.set({ name: true, phone: true, email: true });

    if (!this.isNameValid() || !this.isPhoneValid() || !this.isEmailValid()) {
      return;
    }

    this.isSubmitting.set(true);

    setTimeout(() => {
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const year = new Date().getFullYear();
      const ref = `SKN-${year}-${randomId}`;

      const now = new Date();
      const timeFormatted = now.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) + ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      this.ticketRef.set(ref);
      this.submittedAt.set(timeFormatted);
      this.isSubmitting.set(false);
      this.isSubmitted.set(true);

      if (typeof window !== 'undefined') {
        const formEl = document.getElementById('simple-contact-card');
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 600);
  }

  copyTicket(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.ticketRef()).then(() => {
        this.isCopied.set(true);
        setTimeout(() => this.isCopied.set(false), 2500);
      });
    }
  }

  getWhatsAppChatUrl(): string {
    const countryName = this.allCountries.find(c => c.code === this.selectedCountryCode)?.name || 'International';
    const text = encodeURIComponent(
      `॥ ॐ नमः शिवाय ॥\n\n` +
      `Pranam! I have submitted an inquiry at Sakoon Temple.\n\n` +
      `• Ref ID: ${this.ticketRef()}\n` +
      `• Name: ${this.name}\n` +
      `• Contact: ${this.phoneCode} ${this.phone}\n` +
      `• Country: ${countryName}\n` +
      `• Topic: ${this.queryTopic}\n` +
      (this.message ? `• Note: ${this.message}\n` : '') +
      `\nKindly assist me. Jai Shri Krishna!`
    );
    return `https://wa.me/919876543210?text=${text}`;
  }

  resetForm(): void {
    this.name = '';
    this.phone = '';
    this.email = '';
    this.message = '';
    this.touched.set({ name: false, phone: false, email: false });
    this.isSubmitted.set(false);
    this.isCopied.set(false);
  }
}
