/**
 * Service Factory
 * Creates service instances with proper dependency injection
 * Implements Factory pattern for service instantiation
 */

import { AuthService } from "./auth.service";
import { UserService } from "./user.service";
import { ProductService } from "./product.service";
import { GameService } from "./game.service";
import { AuthRepository } from "@/infrastructure/repositories/auth.repository";
import { UserRepository } from "@/infrastructure/repositories/user.repository";
import { ProductRepository } from "@/infrastructure/repositories/product.repository";
import { GameRepository } from "@/infrastructure/repositories/game.repository";
import { HttpClientFactory } from "@/infrastructure/http/http-client.factory";

/**
 * Service Factory
 * Centralizes service creation and dependency injection
 */
export class ServiceFactory {
  private static authService: AuthService | null = null;
  private static userService: UserService | null = null;
  private static productService: ProductService | null = null;
  private static gameService: GameService | null = null;

  /**
   * Creates or returns singleton AuthService instance
   */
  static getAuthService(): AuthService {
    if (!this.authService) {
      const httpClient = HttpClientFactory.getDummyJsonClient();
      const repository = new AuthRepository(httpClient);
      this.authService = new AuthService(repository);
    }

    return this.authService;
  }

  /**
   * Creates or returns singleton UserService instance
   */
  static getUserService(): UserService {
    if (!this.userService) {
      const httpClient = HttpClientFactory.getDummyJsonClient();
      const repository = new UserRepository(httpClient);
      this.userService = new UserService(repository);
    }

    return this.userService;
  }

  /**
   * Creates or returns singleton ProductService instance
   */
  static getProductService(): ProductService {
    if (!this.productService) {
      const httpClient = HttpClientFactory.getDummyJsonClient();
      const repository = new ProductRepository(httpClient);
      this.productService = new ProductService(repository);
    }

    return this.productService;
  }

  /**
   * Creates or returns singleton GameService instance
   */
  static getGameService(): GameService {
    if (!this.gameService) {
      const httpClient = HttpClientFactory.getRawgClient();
      const repository = new GameRepository(httpClient);
      this.gameService = new GameService(repository);
    }

    return this.gameService;
  }

  /**
   * Resets all service instances (useful for testing)
   */
  static reset(): void {
    this.authService = null;
    this.userService = null;
    this.productService = null;
    this.gameService = null;
  }
}
