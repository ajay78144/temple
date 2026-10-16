import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
export class ContactComponent {
  // Form fields
  name = '';
  phone = '';
  email = '';
  city = '';
  gotra = '';
  queryType = 'General Darshan & Aarti Inquiry';
  preferredDate = '';
  preferredTime = 'Morning (07:00 AM — 11:00 AM)';
  contactMethod = 'WhatsApp';
  message = '';

  // Validation & status signals
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
  minDate = new Date().toISOString().split('T')[0];

  // Interactive FAQs
  readonly faqs = signal<ContactFaq[]>([
    {
      q: 'Is there an entry fee or ticket required to visit Sakoon Temple?',
      a: 'No. General Darshan at Sakoon Temple is completely free for all devotees from all walks of life. Free satvik charanamrit and prasad are distributed after morning and evening Aartis.',
      isOpen: true
    },
    {
      q: 'What facilities are available for senior citizens and differently-abled devotees?',
      a: 'Sakoon Temple is fully wheelchair accessible with gentle marble ramps, dedicated priority darshan lines, free wheelchairs at the entrance gate, and temple battery cart assistance.',
      isOpen: false
    },
    {
      q: 'How can I schedule a personal Havan, Kundali reading, or new car Vahan Pujan?',
      a: 'You can book your preferred date and time slot directly on our website via the "Book Slot" page, or call our Priest Helpline (+91 98765 43210). Prior booking ensures personalized attention and prepared Vedic samagri.',
      isOpen: false
    },
    {
      q: 'What is the recommended dress code and temple etiquette?',
      a: 'Modest and traditional Indian attire (Kurta/Pajama, Dhoti, Saree, Salwar Kameez) is recommended. Devotees are requested to remove footwear at the free shoe counter and keep mobile phones on silent mode.',
      isOpen: false
    },
    {
      q: 'Where can pilgrims park their vehicles?',
      a: 'The temple complex features a sprawling, secure parking facility accommodating over 300 cars and 500 two-wheelers, located just 50 meters from the main gate with complimentary parking assistance.',
      isOpen: false
    }
  ]);

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
    return this.name.trim().length >= 3;
  }

  isPhoneValid(): boolean {
    const clean = this.phone.replace(/[\s\-\(\)\+]/g, '');
    return clean.length >= 10;
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

    // Realistic smooth submission delay with sacred confirmation
    setTimeout(() => {
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const year = new Date().getFullYear();
      const ref = `SKN-${year}-${randomId}`;
      
      const now = new Date();
      const timeFormatted = now.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) + ', ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      this.ticketRef.set(ref);
      this.submittedAt.set(timeFormatted);
      this.isSubmitting.set(false);
      this.isSubmitted.set(true);

      if (typeof window !== 'undefined') {
        const formEl = document.getElementById('devotee-inquiry-box');
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 700);
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
    const text = encodeURIComponent(
      `॥ ॐ नमः शिवाय ॥\n\nJai Shri Krishna! I have submitted an inquiry at Sakoon Temple.\n\n` +
      `• Ticket Ref: ${this.ticketRef()}\n` +
      `• Devotee: ${this.name}\n` +
      `• Mobile: ${this.phone}\n` +
      `• Subject: ${this.queryType}\n` +
      `• Preferred Slot: ${this.preferredTime}\n` +
      `• Preferred Method: ${this.contactMethod}\n\n` +
      `Kindly assist me with my inquiry. Pranam!`
    );
    return `https://wa.me/919876543210?text=${text}`;
  }

  resetForm(): void {
    this.name = '';
    this.phone = '';
    this.email = '';
    this.city = '';
    this.gotra = '';
    this.preferredDate = '';
    this.message = '';
    this.touched.set({ name: false, phone: false, email: false });
    this.isSubmitted.set(false);
    this.isCopied.set(false);
  }
}
