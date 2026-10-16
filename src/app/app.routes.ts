import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ServicesComponent } from './pages/services/services';
import { ServiceDetailComponent } from './pages/service-detail/service-detail';
import { CalendarComponent } from './pages/calendar/calendar';
import { BookingComponent } from './pages/booking/booking';
import { TimingsComponent } from './pages/timings/timings';
import { AboutComponent } from './pages/about/about';
import { ContactComponent } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Sakoon Temple | Peace & Vedic Sanctum' },
  { path: 'services', component: ServicesComponent, title: 'Sacred Services & Rites | Sakoon Temple' },
  { path: 'services/:slug', component: ServiceDetailComponent, title: 'Service Details & Vidhi | Sakoon Temple' },
  { path: 'calendar', component: CalendarComponent, title: 'Combined Hindu Panchang & Calendar | Sakoon Temple' },
  { path: 'booking', component: BookingComponent, title: 'Book Sacred Slot & Puja | Sakoon Temple' },
  { path: 'timings', component: TimingsComponent, title: 'Temple Timings & Aarti Schedule | Sakoon Temple' },
  { path: 'about', component: AboutComponent, title: 'About Us & Sanatana Heritage | Sakoon Temple' },
  { path: 'contact', component: ContactComponent, title: 'Contact & How to Reach | Sakoon Temple' },
  { path: '**', redirectTo: '' }
];
