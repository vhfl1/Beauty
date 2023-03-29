package kr.co.beauty.service;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.beauty.dao.MainDAO;

@Service
public class UtilService {

	@Autowired
	private MainDAO dao;

	public String header(Principal principal, String nomember) {
		String uid = null;
		if (principal != null) {
			uid = principal.getName();
		}
		return dao.countCart(uid, nomember);
	}

}
