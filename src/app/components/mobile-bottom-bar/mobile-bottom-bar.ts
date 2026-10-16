import { Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mobile-bottom-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './mobile-bottom-bar.html',
  styleUrl: './mobile-bottom-bar.css'
})
export class MobileBottomBarComponent {
  readonly openMenu = output<void>();

  onMenuClick(): void {
    this.openMenu.emit();
  }
}
