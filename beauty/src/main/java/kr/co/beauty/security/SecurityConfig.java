/*
 * 날짜 : 2023-03-07
 * 이름 : 강중현
 * 내용 : security 보안설정
 */
package kr.co.beauty.security;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	
	@Autowired
	AccessDeniedHandlerImpl accessDeniedHandler;
	@Autowired
	AuthenticationEntryPointImpl authenticationEntryPoint;
	
	// 자동로그인
	private final DataSource dataSource;
	// 자동로그인
	@Autowired
	private SecurityUserService userService;
	
	// 로그인 alert
//	private final AuthenticationFailureHandler customFailureHandler;
	
	@Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        // 정적 자원에 대해서 Security를 적용하지 않음으로 설정
        return (web) -> web.ignoring().requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }
	
	@Bean
	protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		
		//사이트 위조 방지 설정 -> 배포시 제거
		//http.cors().and().csrf().disable();
		
		//인가(접근권한) 설정
		http.authorizeHttpRequests()
			.requestMatchers("/myshop/**").authenticated()
			.requestMatchers("/order/orderform?type=guest").permitAll()
			.requestMatchers("/order/orderform/type2/**").permitAll()
			.requestMatchers("/order/orderform/type1/**").authenticated()
			.requestMatchers("/order/orderform/**").authenticated()
			.requestMatchers("/**").permitAll();
				
		/*
		//로그인 alert
		http.exceptionHandling()
			//권한이 부족한 경우
			.accessDeniedHandler(accessDeniedHandler)
			//로그인이 되지 않은 경우
			.authenticationEntryPoint(authenticationEntryPoint);
		*/
		
		//로그인 설정
		http.formLogin()
			.loginPage("/member/login")
			.defaultSuccessUrl("/")
			.failureUrl("/member/login?success=101")
			.usernameParameter("uid")
			.passwordParameter("password");
			
				
		//로그아웃 설정
		http.logout()
			.invalidateHttpSession(true)
			.logoutRequestMatcher(new AntPathRequestMatcher("/member/logout"))
			.logoutSuccessUrl("/member/login?success=200");
		
		// 자동로그인 설정(수정된부분)
		http.rememberMe()
			.rememberMeParameter("autoLogin")
			.tokenValiditySeconds(60*60*24*3)
			.userDetailsService(userService);
		
		
		return http.build();
	}
	
	/*
	// 자동로그인
	@Bean
    public PersistentTokenRepository tokenRepository() {
      // JDBC 기반의 tokenRepository 구현체
        JdbcTokenRepositoryImpl jdbcTokenRepository = new JdbcTokenRepositoryImpl();
        jdbcTokenRepository.setDataSource(dataSource); // dataSource 주입
        return jdbcTokenRepository;
    }
	
	// 자동로그인
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		// Security 사용자에 대한 권한 설정 (noop은 평문으로 저장해줌)
		//auth.inMemoryAuthentication().withUser("admin").password("{noop}1234").roles("ADMIN");
		//auth.inMemoryAuthentication().withUser("manager").password("{noop}1234").roles("MANAGER");
		//auth.inMemoryAuthentication().withUser("member").password("{noop}1234").roles("MEMBER");
	
		// 로그인 인증 처리 서비스, 암호화 방식 설정(필수 설정)
		auth.userDetailsService(userService).passwordEncoder(new BCryptPasswordEncoder());
	}
	*/
	// 비밀번호 암호화
	@Bean
    public PasswordEncoder encoder() {
		return new BCryptPasswordEncoder();

	}
}
